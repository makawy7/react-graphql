import React from 'react'
import { twMerge } from 'tailwind-merge'

export default class SliderArrow extends React.Component {
  render() {
    const { direction, onClick } = this.props
    return (
      <button
        onClick={onClick}
        className={twMerge(
          'absolute top-1/2 z-10 block h-fit w-fit -translate-y-1/2 cursor-pointer bg-neutral-800/80 p-1 py-2 text-white',
          direction === 'left' ? 'left-2' : 'right-2',
        )}
      >
        {direction === 'left' ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        )}
      </button>
    )
  }
}
