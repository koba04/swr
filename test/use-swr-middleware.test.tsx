import { render, screen } from '@testing-library/react'
import React from 'react'
import { useSWRWithPlugins, Plugin } from '../src'

describe('useSWRWithPlugins', () => {
  it('should be able to pass plugins', async () => {
    const logs = []
    const keyDecoratorPlugin: Plugin = next => (
      key: any,
      fn: any,
      config: any
    ) => {
      // console.log('call keyDecorator');
      const result = next(`[${key}]`, fn, config)
      return result
    }
    const loggerPlugin: Plugin = next => (key: any, fn: any, config: any) => {
      // console.log('call logger');
      const result = next(key, fn, config)
      logs.push({ key, data: result.data })
      return result
    }
    function Page() {
      const { data } = useSWRWithPlugins(
        'useSWRWithPlugins-1',
        key => key + 'SWR',
        { use: [keyDecoratorPlugin, loggerPlugin] }
      )
      return <div>hello, {data}</div>
    }
    const { container } = render(<Page />)

    // hydration
    expect(container.firstChild.textContent).toMatchInlineSnapshot(`"hello, "`)

    // mounted
    await screen.findByText('hello, [useSWRWithPlugins-1]SWR')
    expect(logs).toEqual([
      { key: '[useSWRWithPlugins-1]', data: undefined },
      { key: '[useSWRWithPlugins-1]', data: '[useSWRWithPlugins-1]SWR' }
    ])
  })
})
