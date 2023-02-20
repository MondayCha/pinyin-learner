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
  onChange?: (value: string) => void
}

export default function FourLinesGrid(props: FourLinesGridProps) {
  const { original, capitalized = true } = props

  const [value, setValue] = useControllableValue<string>(props, {
    valuePropName: 'modified',
  })
  const [focued, { toggle }] = useBoolean(false)

  const clickSound = React.useMemo(() => {
    return new Audio(clickSoundPath)
  }, [])
  const beepSound = React.useMemo(() => {
    return new Audio(beepSoundPath)
  }, [])
  const hintSound = React.useMemo(() => {
    return new Audio(hintSoundPath)
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
          className={styles.dummyInput}
        />
      </div>
    </div>
  )
}
