import React from 'react'
import Layout from '@/components/app/layout'
import {Signature} from './confirm'
import Balancer from 'react-wrap-balancer'

const ConfirmedSubscriptionPage = () => {
  return (
    <Layout>
      <main className="flex flex-grow flex-col items-center justify-center px-5">
        <Image />
        <div className="max-w-lg text-center">
          <h1 className="py-8 text-3xl font-medium lg:text-4xl">
            You're Confirmed!
          </h1>
          <p className="mx-auto pb-8 leading-relaxed sm:text-xl">
            <Balancer>
              Thanks for confirming your email address — you're all set to
              receive emails from me about {process.env.NEXT_PUBLIC_SITE_TITLE}.
            </Balancer>
          </p>
          <Signature />
        </div>
      </main>
    </Layout>
  )
}

export default ConfirmedSubscriptionPage

const Image = () => {
  return null
}
