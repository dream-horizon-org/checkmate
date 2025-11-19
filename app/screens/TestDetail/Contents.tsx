import {InputLabels} from '../TestList/InputLabels'

export const TextContent = ({
  data,
  heading,
}: {
  data: string | undefined
  heading: string
}) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  return (
    data && (
      <div className="flex flex-col w-full">
        <InputLabels labelName={heading} />
        <div className="mt-2 p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 leading-relaxed overflow-y-auto resize-y min-h-[120px] max-h-[400px]">
          {data
            .replace(/\\n/g, '\n')
            .split('\n')
            .map((line, index) => (
              <p key={index} className="mb-2 last:mb-0">
                {line.split(urlRegex).map((part, i) =>
                  urlRegex.test(part) ? (
                    <a
                      key={i}
                      href={part}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline">
                      {part}
                    </a>
                  ) : (
                    part
                  ),
                )}
              </p>
            ))}
        </div>
      </div>
    )
  )
}

export const OptionContent = ({
  data,
  heading,
}: {
  data: string | undefined
  heading: string
}) => {
  return (
    data && (
      <div>
        <InputLabels labelName={heading} />
        <p className="text-sm text-slate-700 mt-1.5">{data}</p>
      </div>
    )
  )
}

export const LinkContent = ({
  data,
  heading,
}: {
  data: string | undefined
  heading: string
}) => {
  return (
    data && (
      <div>
        <InputLabels labelName={heading} />
        <a
          href={data}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-800 mt-1.5 inline-block underline">
          {data}
        </a>
      </div>
    )
  )
}
