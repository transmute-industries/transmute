import fs from 'fs'
import * as cose from '@transmute/cose'

import { Arguments } from "../types"

import { setSecret, setOutput, debug } from '@actions/core'

import { env } from '../action'
import { base64url } from 'jose'
import moment from 'moment'

export const handler = async function ({ positionals, values }: Arguments) {
  positionals = positionals.slice(1)
  const operation = positionals.shift()
  switch (operation) {
    case 'issue-statement': {
      const output = values.output
      const verbose = values.verbose || false
      const [pathToPrivateKey, pathToStatement] = positionals
      const privateKey = cose.cbor.decode(fs.readFileSync(pathToPrivateKey))
      const thumbprint: any = privateKey.get(2) || await cose.key.thumbprint.calculateCoseKeyThumbprint(privateKey)
      if (verbose) {
        const message = `🔑 ${Buffer.from(thumbprint).toString('hex')}`
        debug(message)
      }
      if (env.github()) {
        if (privateKey.get(-4)) {
          setSecret(Buffer.from(privateKey.get(-4)).toString('hex'))
        }
      }
      let alg = values.alg
      if (privateKey.get(3)) {
        alg = cose.IANACOSEAlgorithms[`${privateKey.get(3)}`].Name
      }

      if (!alg) {
        const message = `❌ --alg is required when not present in private key`
        console.error(message)
        throw new Error(message)
      }
      const statement = fs.readFileSync(pathToStatement)

      const headerParamEntries = [
        [cose.Protected.Alg, privateKey.get(3)],
        [cose.Protected.PayloadHashAlgorithm, cose.Hash.SHA256],
        // TODO: other commmand line options for headers
      ] as cose.HeaderMapEntry[]
      const cwtClaimsInHeader = new Map<any, any>()

      cwtClaimsInHeader.set(6, moment().unix()) // iat now

      if (values['content-type']) {
        headerParamEntries.push([cose.Protected.PayloadPreImageContentType, values['content-type']])
      }

      if (values['location']) {
        headerParamEntries.push([cose.Protected.PayloadLocation, values['location']])
      }

      if (values.iss || values.sub) {
        // https://www.iana.org/assignments/cwt/cwt.xhtml
        if (values.iss) {
          cwtClaimsInHeader.set(1, values.iss)
        }
        if (values.sub) {
          cwtClaimsInHeader.set(2, values.sub)
        }
      }

      headerParamEntries.push([cose.Protected.CWTClaims, cwtClaimsInHeader])

      const coseSign1 = await cose.hash
        .signer({
          remote: cose.crypto.signer({
            privateKeyJwk: await cose.key.convertCoseKeyToJsonWebKey(privateKey),
          }),
        })
        .sign({
          protectedHeader: cose.ProtectedHeader(headerParamEntries),
          unprotectedHeader: new Map<any, any>(),
          payload: statement,
        })

      if (output) {
        fs.writeFileSync(output, Buffer.from(coseSign1))
      }

      if (env.github()) {
        setOutput('cbor', Buffer.from(coseSign1).toString('hex'))
      } else {
        if (!output) {
          const text = await cose.cbor.diagnose(Buffer.from(coseSign1))
          console.log(text)
        }
      }
      break
    }
    case 'verify-statement-hash': {
      const output = values.output
      const verbose = values.verbose || false
      const [pathToPublicKey, pathToSignatures, hash] = positionals
      const publicKey = cose.cbor.decode(fs.readFileSync(pathToPublicKey))
      const thumbprint: any = publicKey.get(2) || await cose.key.thumbprint.calculateCoseKeyThumbprint(publicKey)
      if (verbose) {
        const message = `🔑 ${Buffer.from(thumbprint).toString('hex')}`
        debug(message)
      }
      let alg = values.alg
      if (publicKey.get(3)) {
        alg = cose.IANACOSEAlgorithms[`${publicKey.get(3)}`].Name
      }

      if (!alg) {
        const message = `❌ --alg is required when not present in public key`
        console.error(message)
        throw new Error(message)
      }
      const coseSign1 = fs.readFileSync(pathToSignatures)
      const result = await cose.attached
        .verifier({
          resolver: {
            resolve: async () => {
              return cose.key.convertCoseKeyToJsonWebKey(publicKey)
            }
          }
        })
        .verify({
          coseSign1
        })
      if (hash) {
        if (hash.toLowerCase() !== Buffer.from(result).toString('hex')) {
          throw new Error(`Signature verification failed for hash: ${Buffer.from(result).toString('hex')}`)
        }
      } else {
        throw new Error(`Unable to verify signature for hash: ${Buffer.from(result).toString('hex')}`)
      }
      if (output) {
        fs.writeFileSync(output, Buffer.from(result))
      }
      if (env.github()) {
        setOutput('cbor', Buffer.from(result).toString('hex'))
      } else {
        if (!output) {
          const text = await cose.cbor.diagnose(Buffer.from(coseSign1))
          console.log(text)
        }
      }
      break
    }
    case 'issue-receipt': {
      const log = values.log
      const output = values.output
      const verbose = values.verbose || false
      const [pathToPrivateKey, pathToSignedStatement] = positionals
      const privateKey = cose.cbor.decode(fs.readFileSync(pathToPrivateKey))
      const thumbprint: any = privateKey.get(2) || await cose.key.thumbprint.calculateCoseKeyThumbprint(privateKey)

      if (!log) {
        const message = `❌ --log is required (only JSON is supported)`
        console.error(message)
        throw new Error(message)
      }
      if (verbose) {
        const message = `🔑 ${Buffer.from(thumbprint).toString('hex')}`
        debug(message)
      }
      if (env.github()) {
        if (privateKey.get(-4)) {
          setSecret(Buffer.from(privateKey.get(-4)).toString('hex'))
        }
      }
      let alg = values.alg
      if (privateKey.get(3)) {
        alg = cose.IANACOSEAlgorithms[`${privateKey.get(3)}`].Name
      }

      if (!alg) {
        const message = `❌ --alg is required when not present in private key`
        console.error(message)
        throw new Error(message)
      }
      const signedStatement = fs.readFileSync(pathToSignedStatement)

      const notary = cose.detached.signer({
        remote: cose.crypto.signer({
          privateKeyJwk: await cose.key.convertCoseKeyToJsonWebKey(privateKey),
        }),
      });

      let entries = [] as Uint8Array[]
      try {
        entries = JSON.parse(fs.readFileSync(log).toString()).entries.map((leaf) => {
          return base64url.decode(leaf)
        })
      } catch (e) {
        // console.warn('failed to parse transparency log.')
      }

      const headerParamEntries = [
        [cose.Protected.Alg, privateKey.get(3)],
        [cose.Protected.VerifiableDataStructure, cose.VerifiableDataStructures['RFC9162-Binary-Merkle-Tree']],
        // TODO: other commmand line options for headers
      ] as cose.HeaderMapEntry[]

      const cwtClaimsInHeader = new Map<any, any>()
      cwtClaimsInHeader.set(6, moment().unix()) // iat now
      if (values.iss || values.sub) {
        // https://www.iana.org/assignments/cwt/cwt.xhtml
        if (values.iss) {
          cwtClaimsInHeader.set(1, values.iss)
        }
        if (values.sub) {
          cwtClaimsInHeader.set(2, values.sub)
        }
      }
      headerParamEntries.push([cose.Protected.CWTClaims, cwtClaimsInHeader])

      const newLeaf = await cose.receipt.leaf(signedStatement)
      entries.push(newLeaf)
      const receipt = await cose.receipt.inclusion.issue({
        protectedHeader: cose.ProtectedHeader(headerParamEntries),
        entry: entries.length - 1,
        entries: entries,
        signer: notary,
      });

      const encodedLog = entries.map((leaf) => {
        return base64url.encode(leaf)
      })

      const transparentStatement = await cose.receipt.add(
        signedStatement,
        receipt
      );

      if (output) {
        // write log to disk before writing receipt.
        fs.writeFileSync(log, JSON.stringify({ entries: encodedLog }, null, 2))
        fs.writeFileSync(output, Buffer.from(transparentStatement))
      }

      if (env.github()) {
        setOutput('cbor', Buffer.from(transparentStatement).toString('hex'))
      } else {
        if (!output) {
          const text = await cose.cbor.diagnose(Buffer.from(transparentStatement))
          console.log(text)
        }
      }
      break
    }
    case 'verify-receipt-hash': {
      const output = values.output
      const verbose = values.verbose || false
      const [pathToPublicKey, pathToSignatures, hash] = positionals
      const publicKey = cose.cbor.decode(fs.readFileSync(pathToPublicKey))
      const thumbprint: any = publicKey.get(2) || await cose.key.thumbprint.calculateCoseKeyThumbprint(publicKey)
      if (verbose) {
        const message = `🔑 ${Buffer.from(thumbprint).toString('hex')}`
        debug(message)
      }
      const verifier = await cose.receipt.verifier({
        resolve: async (): Promise<cose.PublicKeyJwk> => {
          // TODO: could add support for resolve key from identifier here.
          return await cose.key.convertCoseKeyToJsonWebKey(publicKey)
        }
      });
      const transparentStatement = fs.readFileSync(pathToSignatures)
      const verified = await verifier.verify({
        coseSign1: transparentStatement,
        payload: Buffer.from(hash, 'hex'),
      });
      const root = Buffer.from(verified.receipts[0]).toString('hex')
      if (Buffer.from(verified.payload).toString('hex') !== Buffer.from(hash, 'hex').toString('hex')) {
        throw new Error(`Signature verification failed for hash: ${Buffer.from(verified.payload).toString('hex')}`)
      }
      if (output) {
        fs.writeFileSync(output, Buffer.from(verified.payload))
      }
      if (env.github()) {
        setOutput('cbor', Buffer.from(verified.payload).toString('hex'))
      } else {
        if (!output) {
          console.log('✅ Receipt Verified')
          console.log(`Log: ${root}`)
          console.log(`File: ${hash}`)
          const statement = await cose.cbor.decodeFirst(transparentStatement)
          const statementHeader = cose.cbor.decode(statement.value[0])
          const [encodedReceipt] = statement.value[1].get(cose.Unprotected.Receipts)
          const decodedReceipt = cose.cbor.decode(encodedReceipt)
          const receiptHeader = cose.cbor.decode(decodedReceipt.value[0])
          const receiptClaims = receiptHeader.get(cose.Protected.CWTClaims)
          const statementClaims = statementHeader.get(cose.Protected.CWTClaims)
          if (receiptClaims.get(1)) {
            console.log(`Notary: ${receiptClaims.get(1)}`)
          }
          if (statementClaims.get(1)) {
            console.log(`Producer: ${statementHeader.get(cose.Protected.CWTClaims).get(1)}`)
          }
          if (receiptClaims.get(2)) {
            console.log(`Product: ${receiptClaims.get(2)}`)
          }
        }
      }
      break
    }
    default: {
      const message = `😕 Unknown Command`
      console.error(message)
      throw new Error(message)
    }
  }

}