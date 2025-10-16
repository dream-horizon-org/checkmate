import {Card, CardContent, CardHeader} from '~/ui/card'
import React from 'react'
import {Skeleton} from '@ui/skeleton'

const TEST_STATUS_TO_DISPLAY = [
  'passed',
  'failed',
  'total',
  'untested',
  'retest',
]

export const TEST_STATUS_TEXT_COLOR_MAPPING: {[key: string]: string} = {
  passed: 'text-green-600',
  failed: 'text-red-600',
  retest: 'text-orange-600',
}

export const TEST_STATUS_BG_COLOR_MAPPING: {[key: string]: string} = {
  passed: 'bg-green-50 border-green-200',
  failed: 'bg-red-50 border-red-200',
  retest: 'bg-orange-50 border-orange-200',
  untested: 'bg-slate-50 border-slate-200',
  total: 'bg-blue-50 border-blue-200',
}

export const RunMetaData = ({testRunsMetaData}: {testRunsMetaData: any}) => {
  if (!testRunsMetaData) {
    return (
      <div className="flex gap-4">
        {Array(5)
          .fill(null)
          .map((_, index) => (
            <div
              key={index}
              className="h-24 flex flex-col min-w-32 bg-slate-50 px-4 py-3 rounded-lg border border-slate-200">
              <Skeleton className="h-4 w-16 mb-2 rounded" />
              <Skeleton className="h-7 w-12 rounded" />
            </div>
          ))}
      </div>
    )
  }

  return (
    <div className="flex gap-4">
      {Object.keys(testRunsMetaData).map((key, index) => {
        if (TEST_STATUS_TO_DISPLAY.includes(key)) {
          const percentageValue =
            testRunsMetaData['total'] === 0
              ? 0
              : Number(
                  (
                    (testRunsMetaData[key] * 100) /
                    testRunsMetaData['total']
                  ).toFixed(2),
                )

          return (
            <div
              key={index}
              className={`h-24 flex flex-col justify-between min-w-32 px-4 py-3 rounded-lg border ${TEST_STATUS_BG_COLOR_MAPPING[key] || 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                  {key}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-2xl font-semibold ${
                    testRunsMetaData[key] > 0 && TEST_STATUS_TEXT_COLOR_MAPPING[key]
                      ? TEST_STATUS_TEXT_COLOR_MAPPING[key]
                      : key === 'total'
                      ? 'text-blue-600'
                      : key === 'untested'
                      ? 'text-slate-600'
                      : 'text-slate-900'
                  }`}>
                  {testRunsMetaData[key]}
                </span>
                {key !== 'total' && (
                  <span className="text-sm text-slate-500 font-medium">
                    {`${percentageValue}%`}
                  </span>
                )}
              </div>
            </div>
          )
        }
      })}
    </div>
  )
}
