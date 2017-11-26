import * as React from 'react'

import './HomePage.css'

import Navbar from '../../Common/Navbar/Navbar'
import Footer from '../../Common/Footer/Footer'

import Intro from '../../Common/Intro/Intro'
import ParticleSplash from '../../Common/ParticleSplash/ParticleSplash'

import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.min.css'

// import { TransmuteFramework } from '../../../environment.web'

// TransmuteFramework.web3.eth.getAccounts((err: any, accounts: string[]) => {
//   if (err) {
//     toast.info(err)
//   }
// })

// try {
//   T.getAccounts()
//     .then((accounts: string[]) => {
//       console.log(accounts)
//     })
//     .catch((err: any) => {
//       toast.error('Please start testrpc!')
//       throw err
//     })
// } catch (e) {
//   toast.info(e)
// }

export default class HomePage extends React.Component<any, any> {
  state = {}
  render() {
    return (
      <div className="home-page-container">
        <ToastContainer
          position="top-right"
          autoClose={7 * 1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
        />
        <Navbar />
        <ParticleSplash />
        <Intro />
        <Footer />
      </div>
    )
  }
}
