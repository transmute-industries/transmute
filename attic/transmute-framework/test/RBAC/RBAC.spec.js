
const Web3 = require('web3')

const AccessControlContract = artifacts.require('./TransmuteFramework/Security/RBAC.sol')

var RBAC = require('accesscontrol');

const {
    grantItemFromEvent,
    grantItemFromValues,
    permissionFromCanRoleActionResourceValues,

    getNiceEsEventFromEventArgs,
    getFSAFromEventArgs,

    isVmException

} = require('../Common')

const fs = require('fs')

const _ = require('lodash')

describe('', () => {

    let ac, tac

    let relaxedPermsAreEqual = (p1, p2) => {
        return _.every([
            p1.granted == p2.granted,
            p1._.role == p2._.role,
            p1._.resource == p2._.resource,
            _.isEqual(p1._.attributes, p2._.attributes),
            p1.resource == p2.resource,
            _.isEqual(p1.attributes, p2.attributes),
        ])
    }

    contract('RBAC', (accounts) => {

        before(async () => {
            ac = new RBAC()
            tac = await AccessControlContract.deployed()
        })

        describe('setAddressRole', () => {
            it('onlyOwner', async () => {
                let tx = await tac.setAddressRole(accounts[2], 'admin', {
                    from: accounts[0]
                })
                let fsa = getFSAFromEventArgs(tx.logs[0].args)
                assert(fsa.type === 'AC_ROLE_ASSIGNED')
                try {
                    tx = await await tac.setAddressRole(accounts[2], 'admin', {
                        from: accounts[1]
                    })
                } catch (e) {
                    assert.equal(isVmException(e), true, "expected an non owner call to getAddressRole to cause a vm exception")
                }
            })
        })

        describe('getAddressRole', () => {
            it('onlyOwner or target address', async () => {
                let acc1Role = await tac.getAddressRole.call(accounts[1], {
                    from: accounts[0]
                })
                assert(acc1Role === '0x0000000000000000000000000000000000000000000000000000000000000000')
                try {
                    let tx = await await tac.getAddressRole.call(accounts[1], {
                        from: accounts[1]
                    })
                } catch (e) {
                    assert.equal(isVmException(e), true, "expected an non owner call to getAddressRole to cause a vm exception")
                }
            })
        })

        describe('setGrant', () => {
            it('owner is allowed to setGrant', async () => {
                let tx = await tac.setGrant('admin', 'grant', 'create:any', ['*'], {
                    from: accounts[0]
                })
                assert(tx.logs.length > 0, 'expected an event when setGrant called by owner')
            })

            it('non owner is not allowed to setGrant', async () => {
                try {
                    let tx = await tac.setGrant('admin', 'grant', 'create:any', ['*'], {
                        from: accounts[1]
                    })
                } catch (e) {
                    assert.equal(isVmException(e), true, "expected an non owner setGrant to cause a vm exception")
                }
            })

            it('grants are resources, and setGrant supports DAC', async () => {
                ac = new RBAC()
                ac.setGrants([
                    { role: 'admin', resource: 'grant', action: 'create:any', attributes: ['*'] },
                    { role: 'goblin', resource: 'grunt', action: 'create:any', attributes: ['*'] }
                ])

                // console.log(permToCreateAnyGrant.granted)
                let tx = await tac.setGrant('admin', 'grant', 'create:any', ['*'], {
                    from: accounts[0]
                })

                tx = await tac.setGrant('admin', 'grunt', 'create:any', ['*'], {
                    from: accounts[0]
                })

                tx = await tac.setAddressRole(accounts[2], 'admin', {
                    from: accounts[0]
                })

                // account 2 is not responsible and lets goblins create grunts, but is still not allowed to create grants...
                tx = await tac.setGrant('goblin', 'grunt', 'create:any', ['*'], {
                    from: accounts[2]
                })

                try {
                    tx = await tac.setGrant('goblin', 'grant', 'create:any', ['*'], {
                        from: accounts[2]
                    })
                } catch (e) {
                    assert.equal(isVmException(e), true, "expected only owner cant setGrants for 'grant' resource.")
                }

                let acAdminCreateAnyEventStorePerm = ac.can('admin').createAny('grant')
                let permissionValues = await tac.canRoleActionResource.call('admin', 'create:any', 'grant')
                let tacAdminCreateAnyGrantPerm = permissionFromCanRoleActionResourceValues(permissionValues)
                assert(tacAdminCreateAnyGrantPerm.granted === true)
                assert(
                    relaxedPermsAreEqual(acAdminCreateAnyEventStorePerm, tacAdminCreateAnyGrantPerm),
                    'expect ac & tac to agree that admins can create any grant'
                );

                let acGoblinCreateAnyGrantPerm = ac.can('goblin').createAny('grant')
                permissionValues = await tac.canRoleActionResource.call('goblin', 'create:any', 'grant')
                let tacGoblinCreateAnyGrantPerm = permissionFromCanRoleActionResourceValues(permissionValues)
                assert(tacGoblinCreateAnyGrantPerm.granted === false)
                assert(
                    relaxedPermsAreEqual(acGoblinCreateAnyGrantPerm, tacGoblinCreateAnyGrantPerm),
                    'expect ac & tac to agree that goblin can not create any grant'
                );

                let acGoblinCreateAnyGruntPerm = ac.can('goblin').createAny('grunt')
                permissionValues = await tac.canRoleActionResource.call('goblin', 'create:any', 'grunt')
                let tacGoblinCreateAnyGruntPerm = permissionFromCanRoleActionResourceValues(permissionValues)
                assert(tacGoblinCreateAnyGruntPerm.granted === true)
                assert(
                    relaxedPermsAreEqual(acGoblinCreateAnyGruntPerm, tacGoblinCreateAnyGruntPerm),
                    'expect ac & tac to agree that goblin can create any grunt'
                );
            })
        })

        describe('canRoleActionResource(role, action, resource) congruity to can(role).action(resource)', () => {

            it('for defined permissions', async () => {
                // We start by granting an admin create:any for event store
                let grantAdminCreateAnyEventStore = { role: 'admin', resource: 'grant', action: 'create:any', attributes: ['*'] }
                ac.setGrants([grantAdminCreateAnyEventStore])
                // A defined permission in Node
                let acAdminCreateAnyEventStorePerm = ac.can('admin').createAny('grant')
                assert(acAdminCreateAnyEventStorePerm.granted, "expect admin can create any grant")
                // Now we do the same in Ethereum
                let tx = await tac.setGrant('admin', 'grant', 'create:any', ['*'], {
                    from: accounts[0]
                })
                let grantFromTxEvent = grantItemFromEvent(tx.logs[0].args)
                let lastGrantIndex = (await tac.grantCount.call()).toNumber() - 1
                let grantValues = await tac.getGrant.call(lastGrantIndex)
                let grantFromMethodCall = grantItemFromValues(grantValues)

                assert(_.isEqual(grantAdminCreateAnyEventStore, grantFromTxEvent))
                assert(_.isEqual(grantFromTxEvent, grantFromMethodCall))

                // A defined permission in Ethereum
                let permissionValues = await tac.canRoleActionResource.call('admin', 'create:any', 'grant')
                let tacAdminCreateAnyGrantPerm = permissionFromCanRoleActionResourceValues(permissionValues)
                assert(
                    relaxedPermsAreEqual(acAdminCreateAnyEventStorePerm, tacAdminCreateAnyGrantPerm),
                    'expect ac & tac to agree that admins can create any grant'
                );
            })

            it('for undefined permissions', async () => {
                // An undefined permission in Node
                let acAdminDeleteAnyEventStorePerm = ac.can('admin').deleteAny('grant')
                assert(!acAdminDeleteAnyEventStorePerm.granted, "expect admin can not delete any grant")
                // An udefined permission in Ethereum
                let permissionValues = await tac.canRoleActionResource.call('admin', 'delete:any', 'grant')
                let tacAdminDeleteAnyEventStorePerm = permissionFromCanRoleActionResourceValues(permissionValues)
                assert(
                    relaxedPermsAreEqual(acAdminDeleteAnyEventStorePerm, tacAdminDeleteAnyEventStorePerm),
                    'expect ac & tac to agree that admins can not delete any grant'
                );
            })

            it('for updated permissions', async () => {
                //  AC: Grant access by passing attributes: ['*']
                let grantAdminCreateAnyEventStore = { role: 'admin', resource: 'grant', action: 'create:any', attributes: ['*'] }
                ac.setGrants([grantAdminCreateAnyEventStore])
                let acAdminCreateAnyEventStorePerm = ac.can('admin').createAny('grant')
                assert(acAdminCreateAnyEventStorePerm.granted, "expect admin can create any grant")
                //  TAC: Grant access by passing attributes: ['*']
                let tx = await tac.setGrant('admin', 'grant', 'create:any', ['*'], {
                    from: accounts[0]
                })
                let grantFromTxEvent = grantItemFromEvent(tx.logs[0].args)
                let lastGrantIndex = (await tac.grantCount.call()).toNumber() - 1
                let grantValues = await tac.getGrant.call(lastGrantIndex)
                let grantFromMethodCall = grantItemFromValues(grantValues)
                assert(_.isEqual(grantAdminCreateAnyEventStore, grantFromTxEvent))
                assert(_.isEqual(grantFromTxEvent, grantFromMethodCall))
                let permissionValues = await tac.canRoleActionResource.call('admin', 'create:any', 'grant')
                let tacAdminCreateAnyGrantPerm = permissionFromCanRoleActionResourceValues(permissionValues)
                assert(
                    relaxedPermsAreEqual(acAdminCreateAnyEventStorePerm, tacAdminCreateAnyGrantPerm),
                    'expect ac & tac to agree that admins can create any grant'
                );
                //  AC: Revoke access by passing attributes: []
                let grantRevokeAdminCreateAnyEventStore = { role: 'admin', resource: 'grant', action: 'create:any', attributes: [] }
                ac.setGrants([grantRevokeAdminCreateAnyEventStore])
                let acAdminCreateAnyEventStorePermUpdated = ac.can('admin').createAny('grant')
                assert(!acAdminCreateAnyEventStorePermUpdated.granted, "expect admin can not create any grant now")
                //  TAC: Revoke access by passing attributes: []
                tx = await tac.setGrant('admin', 'grant', 'create:any', [], {
                    from: accounts[0]
                })
                grantFromTxEvent = grantItemFromEvent(tx.logs[0].args)
                lastGrantIndex = (await tac.grantCount.call()).toNumber() - 1
                grantValues = await tac.getGrant.call(lastGrantIndex)
                grantFromMethodCall = grantItemFromValues(grantValues)

                assert(_.isEqual(grantRevokeAdminCreateAnyEventStore, grantFromTxEvent))
                assert(_.isEqual(grantFromTxEvent, grantFromMethodCall))

                let permissionValuesUpdated = await tac.canRoleActionResource.call('admin', 'create:any', 'grant')
                let tacAdminCreateAnyEventStorePermUpdated = permissionFromCanRoleActionResourceValues(permissionValuesUpdated)
                assert(
                    relaxedPermsAreEqual(acAdminCreateAnyEventStorePermUpdated, tacAdminCreateAnyEventStorePermUpdated),
                    'expect ac & tac to agree that admins can not create any grant'
                );
            })
        })
    })
})
