import React from 'react'
import { Button, Input, Select, Tooltip } from 'antd'
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'

import { Hanzi } from '@/components'

import useProfileBin from './useProfileBin'

import styles from './index.module.less'

import type { HanziCharConfig } from '@/core'

import { CharType, Registry } from '@/core'
import { useBoolean } from 'ahooks'

const mouseEnterDelay = 0.5

export default function Hero() {
  const schemaOptions = Registry.schema.getSchemaOptions()
  const textOptions = Registry.text.getTextOptions()

  const [hiddenPinyin, { toggle: toggleHiddenPinyin }] = useBoolean(false)

  const { bin, onChangeBin } = useProfileBin({
    schemaType: schemaOptions[0]?.type,
    textKey: textOptions[0]?.key,
    inputTextIndex: 0,
    inputPinyin: '',
  })

  const textConfig = React.useMemo(() => {
    return Registry.text.getTextConfig(bin?.textKey || textOptions[0]?.key)
  }, [bin.textKey])

  const currentCharConfig = React.useMemo(() => {
    if (!textConfig) {
      return null
    }
    const text = textConfig.text.filter((item) => item.type === CharType.Hanzi)
    const index = bin.inputTextIndex! % text.length
    return text?.[index] as HanziCharConfig
  }, [textConfig, bin.inputTextIndex])

  const currentPinyin = React.useMemo(() => {
    if (currentCharConfig) {
      return Registry.schema.getPinyin(
        bin.schemaType!,
        currentCharConfig.quanpin,
      )
    }
  }, [currentCharConfig, bin.schemaType])

  React.useEffect(() => {
    if (bin.inputPinyin && bin.inputPinyin === currentPinyin) {
      // onChangeBin 需要函数式更新状态，否则后者 inputPinyin 的变化会重置
      // inputTextIndex 的变化，导致无法切换到下一个字符。
      onChangeBin({
        inputTextIndex: (bin?.inputTextIndex || 0) + 1,
        inputPinyin: '',
      })
    }
  }, [currentPinyin, bin.inputPinyin, bin.inputTextIndex])

  return (
    <div className={styles.app}>
      <div>
        <Hanzi
          zi={currentCharConfig?.char}
          original={currentPinyin}
          modified={bin.inputPinyin}
          onChange={(value) => onChangeBin({ inputPinyin: value })}
          hidden={hiddenPinyin}
        />
      </div>
      <div className={styles.menu}>
        <Input.Group compact>
          <Select
            style={{
              width: 100,
            }}
            options={schemaOptions.map((item) => ({
              value: item.type,
              label: item.displayName,
            }))}
            placeholder='拼写方案'
            value={bin.schemaType}
            onChange={(value) => onChangeBin({ schemaType: value })}
          />
          <Select
            style={{
              width: 130,
            }}
            options={textOptions.map((item) => ({
              value: item.key,
              label: item.title,
            }))}
            placeholder='拼写模板'
            value={bin.textKey}
            onChange={(value) => {
              onChangeBin({ inputTextIndex: 0, textKey: value })
            }}
          />
          <Tooltip overlay='跳转到' mouseEnterDelay={mouseEnterDelay}>
            <Input
              style={{
                width: 80,
              }}
              placeholder='第几个'
              value={bin.inputTextIndex ?? 0}
              type='number'
              max={(textConfig?.text.length ?? 1) - 1}
              min={0}
              onChange={(e) => {
                onChangeBin({
                  inputTextIndex: Number(e.target.value),
                })
              }}
            />
          </Tooltip>
          <Tooltip
            overlay={hiddenPinyin ? '显示注音' : '隐藏注音'}
            mouseEnterDelay={mouseEnterDelay}
          >
            <Button
              icon={hiddenPinyin ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              onClick={toggleHiddenPinyin}
            />
          </Tooltip>
        </Input.Group>
      </div>
    </div>
  )
}
