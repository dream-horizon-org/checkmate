import {DisplaySection} from '@components/SectionList/interfaces'
import {Tooltip} from '@components/Tooltip/Tooltip'
import {ICreateSectionResponse} from '@controllers/sections.controller'
import {Checkbox} from '@ui/checkbox'
import {cn} from '@ui/utils'
import {ChevronDown, ChevronRight, CirclePlus, Pencil} from 'lucide-react'
import React, {memo, useCallback} from 'react'
import {useParams} from 'react-router'
import SectionSkeleton from './SectionSkeleton'
import {getSectionHierarchy} from './utils'

interface IRenderSection {
  sections: DisplaySection[] | null
  level: number
  openSections: number[]
  toggleSection: (id: number) => void
  selectedSections: number[]
  sectionData: ICreateSectionResponse[] | undefined

  applySectionFilter: (
    id: number,
    subSections: DisplaySection[] | undefined,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void
  addSubsectionClicked: (sectionId: number | null) => void
  editSubsectionClicked: (sectionId: number) => void
}

const RenderSections = memo(
  ({
    sections,
    level = 0,
    openSections,
    toggleSection,
    selectedSections,
    applySectionFilter,
    addSubsectionClicked,
    editSubsectionClicked,
    sectionData,
  }: IRenderSection) => {
    sections = sections
      ? sections.sort((a, b) => a.sectionName.localeCompare(b.sectionName))
      : null

    const runId = useParams().runId ? Number(useParams().runId) : 0

    const renderSubSections = useCallback(
      (section: DisplaySection) => {
        if (
          openSections.includes(section.sectionId) &&
          section.subSections?.length > 0
        ) {
          return (
            <div className="pl-3">
              <RenderSections
                sections={section.subSections}
                level={level + 1}
                openSections={openSections}
                toggleSection={toggleSection}
                selectedSections={selectedSections}
                applySectionFilter={applySectionFilter}
                addSubsectionClicked={addSubsectionClicked}
                editSubsectionClicked={editSubsectionClicked}
                sectionData={sectionData}
              />
            </div>
          )
        }
        return null
      },
      [
        level,
        openSections,
        toggleSection,
        selectedSections,
        applySectionFilter,
        addSubsectionClicked,
      ],
    )

    return (
      <ul className="relative" key={`${level}`}>
        {sections !== null ? (
          sections.map((section, index) => (
            <li key={section.sectionId} className="relative py-1">
              <div className="flex flex-row items-center cursor-pointer">
                <div 
                  onClick={() => toggleSection(section.sectionId)}
                  className="p-0.5 hover:bg-slate-100 rounded transition-colors">
                  {openSections.includes(section.sectionId) &&
                  section.subSections?.length > 0 ? (
                    <ChevronDown size={14} className="text-slate-500" />
                  ) : !openSections.includes(section.sectionId) &&
                    section.subSections?.length > 0 ? (
                    <ChevronRight size={14} className="text-slate-500" />
                  ) : (
                    <div className="w-[14px]" />
                  )}
                </div>
                {level > 0 && (
                  <>
                    <div
                      className={`absolute border-l border-slate-300 h-full top-0 left-[-6px] overflow-hidden ${
                        index === sections?.length - 1 ? 'h-1/2' : ''
                      }`}
                    />
                    <div
                      className={cn(
                        'absolute left-[-6px] border-t-[1px] border-slate-300 w-3',
                        section.subSections?.length > 0 ? '' : 'w-6',
                      )}
                    />
                  </>
                )}
                <div className="relative group flex flex-row items-center gap-1">
                  <div
                    className={cn(
                      `flex items-center border border-transparent hover:bg-slate-50 rounded-md px-2 py-1 transition-colors`,
                      selectedSections.includes(section.sectionId)
                        ? 'bg-slate-100 hover:bg-slate-100'
                        : '',
                    )}>
                    <Checkbox
                      style={{
                        borderRadius: 3,
                      }}
                      checkIconClassName="h-3.5 w-3.5 align-middle flex items-center mr-2 cursor-pointer"
                      className="h-3.5 w-3.5 align-middle flex items-center mr-2 cursor-pointer border-slate-300"
                      checked={selectedSections.includes(section.sectionId)}
                      onClick={(e) =>
                        applySectionFilter(
                          section.sectionId,
                          section.subSections,
                          e,
                        )
                      }
                    />
                    <Tooltip
                      anchor={
                        <div
                          onClick={() => toggleSection(section.sectionId)}
                          className="flex flex-row items-center gap-1">
                          <span className="text-sm text-slate-700 truncate">
                            {section.sectionName}
                          </span>
                        </div>
                      }
                      content={
                        <div className="text-sm">
                          {getSectionHierarchy({
                            sectionId: section.sectionId,
                            sectionsData: sectionData,
                          })}
                        </div>
                      }
                    />
                  </div>
                  {!runId && (
                    <div className="flex flex-row items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute top-1/2 left-full transform -translate-y-1/2 ml-2">
                      <Tooltip
                        anchor={
                          <button
                            onClick={() =>
                              addSubsectionClicked(section.sectionId)
                            }
                            className="p-1 hover:bg-slate-100 rounded transition-colors">
                            <CirclePlus
                              size={14}
                              className="text-slate-500 hover:text-slate-700"
                            />
                          </button>
                        }
                        content="Add SubSection"
                      />

                      <Tooltip
                        anchor={
                          <button
                            onClick={() => {
                              editSubsectionClicked(section.sectionId)
                            }}
                            className="p-1 hover:bg-slate-100 rounded transition-colors">
                            <Pencil
                              size={13}
                              className="text-slate-500 hover:text-slate-700"
                            />
                          </button>
                        }
                        content="Edit Section"
                      />
                    </div>
                  )}
                </div>
              </div>
              {renderSubSections(section)}
            </li>
          ))
        ) : (
          <SectionSkeleton />
        )}
      </ul>
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.sections === nextProps.sections &&
      prevProps.openSections === nextProps.openSections &&
      prevProps.selectedSections === nextProps.selectedSections
    )
  },
)

export default RenderSections
