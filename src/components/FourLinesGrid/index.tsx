import React from 'react'
import { useBoolean, useControllableValue } from 'ahooks'

import Grid from './Grid'
import styles from './index.module.less'

import type { GridProps } from './Grid'

import clickSoundPath from '@/assets/sounds/click.wav'
import beepSoundPath from '@/assets/sounds/beep.wav'
import hintSoundPath from '@/assets/sounds/hint.wav'

export interface FourLinesGridProps extends GridProps {
  value?: string
  hidden: boolean
  onChange?: (value: string) => void
}

export default function FourLinesGrid(props: FourLinesGridProps) {
  const { original, capitalized = true, hidden } = props

  const [value, setValue] = useControllableValue<string>(props, {
    valuePropName: 'modified',
  })
  const [focued, { toggle }] = useBoolean(false)

  const clickSound = React.useMemo(() => {
    const audio = new Audio(clickSoundPath)
    audio.volume = 0.7
    return audio
  }, [])
  const beepSound = React.useMemo(() => {
    const audio = new Audio(beepSoundPath)
    audio.volume = 0.3
    return audio
  }, [])
  const hintSound = React.useMemo(() => {
    const audio = new Audio(hintSoundPath)
    audio.volume = 0.25
    return audio
  }, [])

  const handleChange = (nextValue = '') => {
    if (original && original.length >= nextValue.length) {
      setValue((prevValue) => {
        if (prevValue.length < nextValue.length) {
          if (original === nextValue) {
            hintSound.play()
          } else if (original.startsWith(nextValue)) {
            clickSound.play()
          } else {
            beepSound.play()
          }
        }
        return nextValue.toLowerCase()
      })
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.inputContainer}>
          <input
            value={value}
            onChange={(event) => handleChange(event.target.value)}
            onFocus={() => toggle()}
            onBlur={() => toggle()}
          />
        </div>
        <Grid
          capitalized={capitalized}
          original={original}
          modified={value}
          cursor={focued}
          hidden={hidden}
          className={styles.dummyInput}
        />
      </div>
    </div>
  )
}
