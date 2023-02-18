import React from 'react'
import {PortableText, toPlainText} from '@portabletext/react'
import {LinkedIn, Twitter} from '@skillrecordings/react'
import {CalendarIcon} from '@heroicons/react/outline'
import {SanityDocument} from '@sanity/client'
import {useRouter} from 'next/router'
import {format} from 'date-fns'
import JoelHooksHeadshotImage from '../../public/joel-hooks.jpg'
import PortableTextComponents from 'components/portable-text'
import Layout from 'components/layout'
import Image from 'next/legacy/image'
import {SmallCallToActionForm} from '../components/call-to-action-form'
import {genericCallToActionContent} from '../components/landing-content'

import Balancer from 'react-wrap-balancer'
import type {CaseStudy} from 'lib/case-studies'

type CaseStudyTemplateProps = {
  caseStudy: CaseStudy
}

const CaseStudyTemplate: React.FC<
  React.PropsWithChildren<CaseStudyTemplateProps>
> = ({caseStudy}) => {
  const {title, description, body, image, _createdAt: date} = caseStudy

  const shortDescription =
    description || (body && toPlainText(body).substring(0, 157) + '...')

  return (
    <Layout
      className="overflow-hidden"
      meta={{
        title,
        description: shortDescription,
        type: 'article',
        date,
        article: {
          publishedTime: date,
        },
        url: `${process.env.NEXT_PUBLIC_URL}/partners/${caseStudy.slug}`,
        ogImage: {
          url: `https://badass-ogimage.vercel.app/api/card?title=${title}`,
        },
      }}
    >
      <Header title={title} image={image} />
      <main>
        <div className="max-w-screen-md mx-auto w-full">
          <div className="md:pt-16 pt-10 lg:px-0 px-5 pb-16">
            <article className="prose lg:prose-xl sm:prose-lg md:prose-code:text-sm max-w-none prose-p:text-neutral-200 prose-pre:prose-code:bg-transparent prose-code:bg-white/20 prose-code:px-1 prose-code:py-0.5 prose-code:rounded lg:prose-code:text-[78%] sm:prose-code:text-[80%]">
              <PortableText value={body} components={PortableTextComponents} />
            </article>
          </div>
        </div>
        <section data-article="">
          <SmallCallToActionForm content={genericCallToActionContent} />
        </section>
      </main>
    </Layout>
  )
}

export default CaseStudyTemplate

const Header: React.FC<
  React.PropsWithChildren<{title: string; image: string | null | undefined}>
> = ({title, image}) => {
  return (
    <header className="flex items-center justify-center pb-32">
      <div className="flex flex-col items-center px-5">
        {image && (
          <div className="w-80 h-80 flex items-center justify-center relative">
            <Image src={image} layout="fill" className="object-contain" />
          </div>
        )}
        <h1 className="max-w-screen-md w-full sm:text-6xl text-5xl font-heading sm:leading-tight leading-tight text-center pt-16">
          <Balancer>{title}</Balancer>
        </h1>
      </div>
    </header>
  )
}

const Share: React.FC<React.PropsWithChildren<{title: string}>> = ({title}) => {
  const router = useRouter()
  const url = process.env.NEXT_PUBLIC_URL + router.asPath
  const className =
    'p-3 hover:bg-white hover:bg-opacity-10 transition rounded-full focus-visible:ring-white'
  const message = `${title} by @jhooks`

  return (
    <div className="flex">
      <Twitter className={className} link={url} message={message} />
      <LinkedIn className={className} link={url} message={message} />
    </div>
  )
}

export const Author = () => {
  return (
    <div className="flex items-center">
      <Image
        src={JoelHooksHeadshotImage}
        alt="Joel Hooks"
        width={48}
        height={48}
        placeholder="blur"
        priority
        loading="eager"
        className="rounded-full"
      />
      <span className="pl-2 font-medium leading-tight">Joel Hooks</span>
    </div>
  )
}