import React from 'react'
import Layout from '@/components/app/layout'
import {SanityDocument} from '@sanity/client'
import Link from 'next/link'
import Image from 'next/legacy/image'
import Balancer from 'react-wrap-balancer'
import {getAllBonuses} from '../../lib/bonuses'

export async function getStaticProps() {
  const playlists = await getAllBonuses()

  return {
    props: {playlists},
    revalidate: 10,
  }
}

const PlaylistsPage: React.FC<{playlists: SanityDocument[]}> = ({
  playlists,
}) => {
  return (
    <Layout
      meta={{
        title: `Total TypeScript Bonus Content from Matt Pocock`,
        description: `Total TypeScript Bonus Content that will help you learn how to use TypeScript as a professional web developer through exercise driven examples.`,
        ogImage: {
          url: 'https://res.cloudinary.com/total-typescript/image/upload/v1681208741/bonuses-card_2x_bvmiya.png',
        },
      }}
    >
      <main className="relative z-10 flex flex-col items-center justify-center py-32 sm:py-40">
        <h1 className="px-5 text-center font-heading text-5xl font-bold sm:text-5xl">
          Total TypeScript Bonus Content
        </h1>
        <p className="max-w-lg px-5 pt-8 text-center text-lg text-rose-100/90">
          <Balancer>
            A collection of bonus content featuring TypeScript videos for you to
            use on your journey to TypeScript wizardry.
          </Balancer>
        </p>
        {playlists && (
          <ul className="flex max-w-screen-md flex-col gap-5 px-5 pt-10 sm:gap-8 sm:pt-20">
            {playlists.map(
              ({title, slug, image, description, lessons, moduleType}, i) => {
                return (
                  <li
                    key={slug.current}
                    className="relative flex flex-col items-center gap-10 overflow-hidden rounded-lg border border-gray-700/50 bg-black/20 p-10 shadow-2xl md:flex-row"
                  >
                    {image && (
                      <div className="flex flex-shrink-0 items-center justify-center">
                        <Image
                          src={image}
                          alt={title}
                          width={300}
                          quality={100}
                          height={300}
                        />
                      </div>
                    )}
                    <div>
                      <Link
                        href={{
                          pathname: '/bonuses/[module]',
                          query: {
                            module: slug.current,
                          },
                        }}
                        className="text-3xl font-semibold hover:underline sm:text-4xl"
                      >
                        {title}
                      </Link>
                      <div className="pb-3 pt-4 font-mono text-xs font-semibold uppercase text-cyan-300">
                        {i === 0 && (
                          <span className="mr-3 rounded-full bg-cyan-300 px-2 py-0.5 font-sans font-semibold uppercase text-black">
                            New
                          </span>
                        )}
                        {lessons.length} videos
                      </div>
                      {description && (
                        <p className="text-gray-300">{description}</p>
                      )}
                      <Link
                        href={{
                          pathname: '/bonuses/[module]',
                          query: {
                            module: slug.current,
                          },
                        }}
                        className="group mt-5 inline-block gap-2 rounded bg-gray-800 px-4 py-2 font-medium transition hover:bg-gray-700"
                      >
                        View{' '}
                        <span
                          aria-hidden="true"
                          className="text-gray-300 transition group-hover:text-white"
                        >
                          →
                        </span>
                      </Link>
                    </div>
                    <StripesLeft className="absolute left-0 top-0 hidden w-5 md:block" />
                  </li>
                )
              },
            )}
          </ul>
        )}
      </main>
      <Image
        layout="fill"
        aria-hidden="true"
        alt=""
        src={require('../../../public/assets/landing/bg-divider-3.png')}
        objectPosition={'top'}
        className="-z-10 object-contain"
      />
    </Layout>
  )
}

const StripesLeft: React.FC<{className?: string}> = ({className = ''}) => {
  return (
    <svg
      aria-hidden="true"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 28 570"
    >
      <path
        fill="#1F2937"
        fillRule="evenodd"
        d="M0 24.586v2.828l26-26V0h-1.414L0 24.586Zm26-12-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-24.96 24.96c.229.696.492 1.377.79 2.039L26 533.414v-2.828Zm0 14L6.447 564.139c.481.463.985.904 1.509 1.32L26 547.414v-2.828Zm0 14-10.646 10.646c.757.211 1.532.381 2.322.506L26 561.414v-2.828Z"
        clipRule="evenodd"
      />
      <path stroke="#1F2937" strokeWidth="2" d="M27 0v570" />
    </svg>
  )
}

export default PlaylistsPage
