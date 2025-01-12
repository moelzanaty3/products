import * as React from 'react'
import {PortableText} from '@portabletext/react'
import {type PortableTextComponents as PortableTextComponentsType} from '@portabletext/react/src/types'
import {hmsToSeconds} from '@skillrecordings/time'
import ReactMarkdown from 'react-markdown'
import {useMuxPlayer} from '../hooks/use-mux-player'
import {getTranscriptComponents} from '../markdown/transcript-components'
import {cn} from '../utils/cn'

export const VideoTranscript: React.FC<{
  transcript: string | any[]
  withTitle?: boolean
  className?: string
}> = ({transcript, withTitle = true, className}) => {
  const {handlePlay, canShowVideo, muxPlayerRef} = useMuxPlayer()
  const transcriptMarkdownComponent = getTranscriptComponents({
    handlePlay,
    canShowVideo,
    muxPlayerRef,
  })

  if (!transcript) {
    return null
  }

  return (
    <div data-video-transcript="">
      {withTitle && <h2 data-title="">Transcript</h2>}
      <div data-transcript="" className={cn(className)}>
        {typeof transcript === 'string' ? (
          <ReactMarkdown components={transcriptMarkdownComponent}>
            {transcript}
          </ReactMarkdown>
        ) : (
          <PortableText
            value={transcript}
            components={
              {
                marks: {
                  timestamp: ({value}: any) => {
                    const {timestamp} = value
                    return canShowVideo ? (
                      <button
                        data-timestamp=""
                        onClick={() => {
                          if (canShowVideo && muxPlayerRef.current) {
                            muxPlayerRef.current.currentTime =
                              hmsToSeconds(timestamp)
                            handlePlay()
                            window.scrollTo({top: 80})
                          }
                        }}
                      >
                        {timestamp}
                      </button>
                    ) : (
                      timestamp
                    )
                  },
                },
              } as PortableTextComponentsType
            }
          />
        )}
      </div>
    </div>
  )
}
