import React from 'react'
import cx from 'classnames'
import Layout from 'components/app/layout'
import MuxPlayer, {
  MuxPlayerProps,
  MuxPlayerRefAttributes,
} from '@mux/mux-player-react'
import {Tip} from 'lib/tips'
import {
  PortableText,
  PortableTextComponents as PortableTextComponentsType,
} from '@portabletext/react'
import {hmsToSeconds} from '@skillrecordings/time'
import {TipTeaser} from 'pages/tips'
import {useRouter} from 'next/router'
import {
  XIcon,
  ChatAltIcon,
  PlayIcon,
  CheckCircleIcon,
  MailIcon,
} from '@heroicons/react/solid'
import {shuffle, take} from 'lodash'
import {track} from '../utils/analytics'
import Image from 'next/legacy/image'
import {getOgImage} from 'utils/get-og-image'
import {useTipComplete} from '@skillrecordings/skill-lesson/hooks/use-tip-complete'
import {localProgressDb} from '@skillrecordings/skill-lesson/utils/dexie'
import {
  redirectUrlBuilder,
  SubscribeToConvertkitForm,
} from '@skillrecordings/convertkit-react-ui'
import {useConvertkit} from '@skillrecordings/skill-lesson/hooks/use-convertkit'
import {setUserId} from '@amplitude/analytics-browser'
import {ArticleJsonLd, VideoJsonLd} from '@skillrecordings/next-seo'
import Icon from 'components/icons'
import {
  useMuxPlayer,
  VideoProvider,
} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
import {useVideoResource} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {getBaseUrl} from '@skillrecordings/skill-lesson/utils/get-base-url'
import {trpc} from 'trpc/trpc.client'
import {portableTextComponents} from '@skillrecordings/skill-lesson/portable-text'
import Spinner from 'components/spinner'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import {VideoTranscript} from '@skillrecordings/skill-lesson/video/video-transcript'
import KentImage from '../../public/kent-c-dodds.png'

const TipTemplate: React.FC<{
  tip: Tip
  tipBodySerialized: MDXRemoteSerializeResult
  tips: Tip[]
  transcript: any[]
}> = ({tip, tipBodySerialized, tips}) => {
  const muxPlayerRef = React.useRef<MuxPlayerRefAttributes>(null)
  const {subscriber, loadingSubscriber} = useConvertkit()
  const router = useRouter()
  const {tipCompleted} = useTipComplete(tip.slug)
  const {videoResourceId} = useVideoResource()
  const {data: tipResources} = trpc.tipResources.bySlug.useQuery({
    slug: tip.slug,
  })

  const tweet = tipResources?.tweetId

  const ogImage = getOgImage({
    title: tip.title || 'tip',
    type: 'video',
    image: `${process.env.NEXT_PUBLIC_URL}/api/video-thumb?videoResourceId=${videoResourceId}`,
  })

  const handleOnSuccess = (subscriber: any, email?: string) => {
    if (subscriber) {
      const redirectUrl = redirectUrlBuilder(subscriber, router.asPath, {
        confirmToast: 'true',
      })
      email && setUserId(email)
      track('subscribed to email list', {
        lesson: tip.slug,
        module: 'tips',
        location: 'below tip video',
        moduleType: 'tip',
        lessonType: 'tip',
      })
      router.push(redirectUrl).then(() => {
        router.reload()
      })
    }
  }

  console.log('this is the tip info', tip)

  const handleVideoEnded = async () => {
    await localProgressDb.progress
      .add({
        eventName: 'completed video',
        module: 'tips',
        lesson: tip.slug,
        createdOn: new Date(),
      })
      .then(console.debug)
  }

  return (
    <VideoProvider
      muxPlayerRef={muxPlayerRef}
      onEnded={handleVideoEnded}
      exerciseSlug={tip.slug}
      path="/tips"
    >
      <ArticleJsonLd
        url={`${process.env.NEXT_PUBLIC_URL}/tips/${tip.slug}`}
        title={tip.title || 'tip'}
        images={[
          `${getBaseUrl()}/api/video-thumb?videoResourceId=${videoResourceId}`,
        ]}
        datePublished={tip._updatedAt || new Date().toISOString()}
        authorName={`${process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME} ${process.env.NEXT_PUBLIC_PARTNER_LAST_NAME}`}
        description={tip.description || 'Epic Web Tip'}
      />
      <VideoJsonLd
        name={tip.title || 'tip'}
        description={tip.description || 'Epic Web Tip'}
        uploadDate={tip._updatedAt || new Date().toISOString()}
        thumbnailUrls={[
          `https://image.mux.com/${tip.muxPlaybackId}/thumbnail.png?width=480&height=384&fit_mode=preserve`,
        ]}
        contentUrl={`https://stream.mux.com/${tip.muxPlaybackId}/medium.mp4`}
      />
      <Layout
        meta={{
          title: tip.title,
          ogImage,
          description: tip.description ?? '',
        }}
      >
        <main className="mx-auto w-full" id="tip">
          <div className="relative z-10 flex items-center justify-center">
            <div className="flex w-full max-w-screen-xl flex-col">
              <Video ref={muxPlayerRef} tips={tips} />
              {!subscriber && !loadingSubscriber && (
                <SubscribeForm handleOnSuccess={handleOnSuccess} />
              )}
            </div>
          </div>
          <article className="relative z-10 border-l border-transparent px-5 pb-16 pt-8 sm:pt-10 xl:border-gray-800 xl:pt-10">
            <div className="mx-auto w-full max-w-screen-lg pb-5 lg:px-5">
              <div className="flex w-full grid-cols-5 flex-col gap-0 sm:gap-10 xl:grid">
                <div className="col-span-3">
                  <h1 className="font-heading inline-flex w-full max-w-2xl items-baseline text-3xl font-black lg:text-4xl">
                    {tip.title}
                    {tipCompleted && <span className="sr-only">(watched)</span>}
                  </h1>
                  <div className="flex items-center justify-start gap-3 pt-4">
                    <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                      <Image
                        priority={true}
                        src={
                          tip.author && tip.author.name !== null
                            ? tip.author.image
                            : KentImage
                        }
                        alt={
                          tip.author && tip.author.name !== null
                            ? tip.author.imageAlt
                            : 'Kent C. Dodds'
                        }
                        width={50}
                        height={50}
                        quality={100}
                      />
                    </div>

                    <div className="text-lg font-semibold text-gray-700 dark:text-gray-100">
                      {tip.author && tip.author.name !== null
                        ? tip.author.name
                        : 'Kent C. Dodds'}
                    </div>
                  </div>
                  {tipCompleted ? (
                    <div
                      aria-hidden="true"
                      className="flex items-center gap-1 pb-[20px] pt-6"
                    >
                      <Icon
                        name="Checkmark"
                        className="h-5 w-5 text-emerald-600"
                      />
                      <span className="font-heading text-sm font-black uppercase text-emerald-600 opacity-90">
                        Watched
                      </span>
                    </div>
                  ) : (
                    <Hr
                      className={
                        tipCompleted
                          ? 'bg-emerald-400'
                          : 'bg-indigo-500 dark:bg-indigo-400'
                      }
                    />
                  )}
                  {tip.body && (
                    <>
                      <div className="prose w-full max-w-none pb-5 pt-5 dark:prose-invert lg:prose-lg">
                        <MDX contents={tipBodySerialized} />
                      </div>
                      <Hr
                        className={
                          tipCompleted ? 'bg-emerald-400' : 'bg-indigo-400'
                        }
                      />
                    </>
                  )}
                  {tip.transcript && tip.body && (
                    <div className="w-full max-w-2xl pt-5">
                      <VideoTranscript transcript={tip.transcript} />
                    </div>
                  )}
                </div>

                <div className="col-span-2">
                  {/* TODO: might want to add summary? */}
                  {tweet && <ReplyOnTwitter tweet={tweet} />}
                  {tip.body && <RelatedTips currentTip={tip} tips={tips} />}
                </div>
              </div>
            </div>
            <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-10 sm:pt-10 md:flex-row">
              {tip.transcript && !tip.body && (
                <div className="w-full max-w-2xl pt-5">
                  <VideoTranscript transcript={tip.transcript} />
                </div>
              )}
              {!tip.body && <RelatedTips currentTip={tip} tips={tips} />}
            </div>
          </article>
        </main>
      </Layout>
    </VideoProvider>
  )
}

const Video: React.FC<any> = React.forwardRef(({tips}, ref: any) => {
  const {muxPlayerProps, displayOverlay} = useMuxPlayer()
  const {videoResource} = useVideoResource()

  return (
    <div className="relative">
      {displayOverlay && <TipOverlay tips={tips} />}
      <div
        className={cx(
          'flex items-center justify-center  overflow-hidden shadow-gray-600/40 sm:shadow-2xl xl:rounded-b-md',
          {
            hidden: displayOverlay,
          },
        )}
      >
        <MuxPlayer
          ref={ref}
          {...(muxPlayerProps as MuxPlayerProps)}
          playbackId={videoResource?.muxPlaybackId}
        />
      </div>
    </div>
  )
})

const RelatedTips: React.FC<{tips: Tip[]; currentTip: Tip}> = ({
  currentTip,
  tips,
}) => {
  return (
    <section className="mx-auto h-full w-full md:pl-3">
      <h2 className="font-heading pt-2 text-2xl font-black">More Tips</h2>
      <div className="flex flex-col pt-4">
        {tips
          .filter((tip) => tip.slug !== currentTip.slug)
          .map((tip) => {
            return <TipTeaser key={tip.slug} tip={tip} />
          })}
      </div>
    </section>
  )
}

const Hr: React.FC<{className?: string}> = ({className}) => {
  return <div className={cx('my-8 h-1 w-8', className)} aria-hidden="true" />
}

const TipOverlay: React.FC<{tips: Tip[]}> = ({tips}) => {
  const {setDisplayOverlay, handlePlay} = useMuxPlayer()
  const {lesson, module} = useLesson()

  const buttonStyles =
    'py-2 px-3 font-medium rounded-md flex items-center gap-1 hover:bg-gray-700 bg-gray-800 transition text-gray-200'
  return (
    <div
      id="video-overlay"
      className="relative left-0 top-0 flex w-full items-center justify-center bg-gray-950 dark:bg-black/40 lg:aspect-video xl:rounded-md"
    >
      <div className="absolute right-8 top-8 z-50 flex items-center justify-center gap-3">
        <button className={buttonStyles} onClick={handlePlay}>
          Replay <span aria-hidden="true">↺</span>
        </button>
        <button
          className={buttonStyles}
          onClick={() => {
            track('dismissed video overlay', {
              lesson: lesson.slug,
              module: module.slug.current,
              moduleType: module.moduleType,
              lessonType: lesson._type,
            })
            setDisplayOverlay(false)
          }}
        >
          Dismiss <XIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <div className="ft-0 top-0 z-20 flex h-full w-full flex-col items-center justify-center text-center text-lg leading-relaxed lg:absolute">
        {/* <ShareTip lesson={tip} /> */}
        <div className="grid h-auto w-full grid-cols-1 items-center justify-center sm:grid-cols-2 lg:grid-cols-3">
          {take(
            shuffle(
              tips.filter((suggestedTip) => suggestedTip.slug !== lesson.slug),
            ),
            9,
          ).map((tip) => (
            <VideoOverlayTipCard suggestedTip={tip} />
          ))}
        </div>
      </div>
    </div>
  )
}

const VideoOverlayTipCard: React.FC<{suggestedTip: Tip}> = ({suggestedTip}) => {
  const router = useRouter()
  const {handlePlay} = useMuxPlayer()
  const {tipCompleted} = useTipComplete(suggestedTip.slug)

  const thumbnail = `https://image.mux.com/${suggestedTip.muxPlaybackId}/thumbnail.png?width=720&height=405&fit_mode=preserve`

  return (
    <div className="aspect-video">
      <button
        key={suggestedTip.slug}
        onClick={() => {
          track('clicked suggested tip thumbnail', {
            lesson: suggestedTip.slug,
          })

          router
            .push({
              pathname: '/tips/[tip]',
              query: {tip: suggestedTip.slug},
            })
            .then(() => {
              handlePlay()
            })
        }}
        className="group relative z-0 flex h-full w-full items-end justify-start overflow-hidden rounded-lg border border-gray-800 bg-gray-900 p-8 text-left font-medium leading-tight text-gray-100"
      >
        <div className="relative z-10 flex flex-col">
          <span className="font-heading pb-1 text-xs font-bold uppercase tracking-wide text-gray-400">
            Tip
          </span>
          <span className="font-medium">
            {suggestedTip.title}{' '}
            {tipCompleted && <span className="sr-only">(watched)</span>}
          </span>
        </div>
        <Image
          src={thumbnail}
          alt=""
          aria-hidden="true"
          layout="fill"
          className="blur-xs z-0 object-cover opacity-50 brightness-50"
          quality={100}
        />
        <div
          className="absolute left-0 top-0 flex h-full w-full items-start justify-end p-5"
          aria-hidden="true"
        >
          {tipCompleted ? (
            <>
              <CheckCircleIcon
                className="absolute h-10 w-10 text-teal-400 transition group-hover:opacity-0"
                aria-hidden="true"
              />
              <PlayIcon className="h-10 w-10 flex-shrink-0 scale-50 text-teal-400 opacity-0 transition group-hover:scale-100 group-hover:opacity-100" />
            </>
          ) : (
            <PlayIcon className="h-10 w-10 flex-shrink-0 scale-50 text-gray-300 opacity-0 transition group-hover:scale-100 group-hover:opacity-100" />
          )}
        </div>
      </button>
    </div>
  )
}

const ReplyOnTwitter: React.FC<{tweet: string}> = ({tweet}) => {
  return (
    <a
      href={`https://twitter.com/i/status/${tweet}`}
      target="_blank"
      rel="noopener noreferrer"
      className="relative mb-5 mt-2 inline-flex flex-shrink-0 items-center justify-center space-x-2 bg-gray-700 px-5 py-4 font-semibold text-white transition-all duration-300 ease-in-out before:absolute before:left-0 before:top-0 before:z-[-1] before:h-full before:w-0 before:bg-gray-600 before:transition-all before:duration-300 before:ease-in-out  hover:brightness-110 hover:before:w-full focus-visible:ring-white"
      onClick={() => {
        track('clicked reply on twitter')
      }}
    >
      <ChatAltIcon
        aria-hidden="true"
        className="relative h-5 w-5 text-sky-500"
      />
      <span>Discuss on Twitter</span>
    </a>
  )
}

const SubscribeForm = ({
  handleOnSuccess,
}: {
  handleOnSuccess: (subscriber: any, email?: string) => void
}) => {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center justify-between gap-5 border-b border-gray-100 px-3 pb-5 pt-4 dark:border-white/5 md:pb-3 md:pt-3 lg:max-w-none lg:flex-row 2xl:px-0">
      <div className="inline-flex items-center gap-2 text-lg font-semibold leading-tight md:text-base lg:flex-shrink-0 lg:text-lg">
        <div
          aria-hidden="true"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/10 dark:bg-blue-400/10"
        >
          <MailIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
        </div>{' '}
        New EpicWeb tips delivered to your inbox
      </div>
      <SubscribeToConvertkitForm
        actionLabel="Subscribe for EpicWeb tips"
        onSuccess={(subscriber, email) => {
          return handleOnSuccess(subscriber, email)
        }}
      />
    </div>
  )
}

export default TipTemplate
