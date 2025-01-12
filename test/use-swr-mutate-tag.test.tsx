import { screen, fireEvent } from '@testing-library/react'
import useSWR, { useSWRConfig } from 'swr'
import { createKey, createResponse, renderWithConfig } from './utils'
import useSWRInfinite from 'swr/infinite'

describe('mutateTag', () => {
  it('should support mutate tag', async () => {
    const key1 = createKey()
    const key2 = createKey()
    const key3 = createKey()
    const key4 = createKey()

    let count1 = 0
    let count2 = 0
    let count3 = 0
    let count4 = 0

    function Page() {
      const { data: data1 } = useSWR(key1, () => ++count1, { tag: ['tag1'] })
      const { data: data2 } = useSWR(key2, () => ++count2, {
        tag: ['tag1', 'tag2']
      })
      const { data: data3 } = useSWR(key3, () => ++count3, { tag: ['tag2'] })
      const { data: data4 } = useSWR(key4, () => ++count4)
      const { mutateTag } = useSWRConfig()

      return (
        <div>
          <button
            onClick={() => {
              mutateTag('tag1')
            }}
          >
            click
          </button>
          <p>data1:{data1}</p>
          <p>data2:{data2}</p>
          <p>data3:{data3}</p>
          <p>data4:{data4}</p>
        </div>
      )
    }

    renderWithConfig(<Page />)

    await screen.findByText('data1:1')
    screen.getByText('data2:1')
    screen.getByText('data3:1')
    screen.getByText('data4:1')

    fireEvent.click(screen.getByText('click'))
    await screen.findByText('data1:2')
    screen.getByText('data2:2')
    screen.getByText('data3:1')
    screen.getByText('data4:1')
  })
  it("should support useSWRInfinite's mutate tag", async () => {
    const key1 = createKey()
    const key2 = createKey()

    let count1 = 0
    let count2 = 0

    const infiniteKey1 = createKey()
    const infiniteKey2 = createKey()

    let infiniteCount1 = 0
    let infiniteCount2 = 0

    function Page() {
      const { data: data1 } = useSWR(key1, () => createResponse(++count1), {
        tag: ['tag1']
      })
      const { data: data2 } = useSWR(key2, () => createResponse(++count2), {
        tag: ['tag2']
      })
      const { data: infiniteData1 } = useSWRInfinite(
        index => `page-${index}-${infiniteKey1}`,
        () => createResponse(++infiniteCount1),
        { tag: ['tag1'] }
      )
      const { data: infiniteData2 } = useSWRInfinite(
        index => `page-${index}-${infiniteKey2}`,
        () => createResponse(++infiniteCount2),
        { tag: ['tag2'] }
      )

      const { mutateTag } = useSWRConfig()

      return (
        <div>
          <button
            onClick={() => {
              mutateTag('tag1')
            }}
          >
            click
          </button>
          <p>data1:{data1}</p>
          <p>data2:{data2}</p>
          <p>infiniteData1:{infiniteData1}</p>
          <p>infiniteData2:{infiniteData2}</p>
        </div>
      )
    }

    renderWithConfig(<Page />)

    await screen.findByText('data1:1')
    screen.getByText('data2:1')
    screen.getByText('infiniteData1:1')
    screen.getByText('infiniteData2:1')

    fireEvent.click(screen.getByText('click'))
    await screen.findByText('data1:2')
    screen.getByText('data2:1')
    screen.getByText('infiniteData1:2')
    screen.getByText('infiniteData2:1')
  })
  it.todo("should support useSWRSubscription's mutate tag")
})
