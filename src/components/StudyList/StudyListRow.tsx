// src/components/StudyList/StudyListRow.tsx
import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

export interface Cell {
  content: React.ReactNode;
  title?: string;
  gridCol: number;
}

export interface TableData {
  row: Cell[];
  expandedContent: React.ReactNode;
  onClickRow: () => void;
  isExpanded: boolean;
  dataCY?: string;
  clickableCY?: string;
}

interface StudyListTableRowProps {
  tableData: TableData;
}

export function StudyListRow({ tableData }: StudyListTableRowProps) {
  const { row, expandedContent, onClickRow, isExpanded, dataCY, clickableCY } = tableData;

  return (
    <>
      <tr className="select-none" data-cy={dataCY}>
        <td className={`border-0 p-0 ${isExpanded ? 'border-gray-600 bg-gray-900 border-b' : ''}`}>
          <div
            className={`w-full transition duration-300 ${
              isExpanded
                ? 'border-gray-400 hover:border-gray-500 mb-2 overflow-visible rounded border'
                : 'border-transparent'
            }`}
          >
            <table className="w-full p-4">
              <tbody>
                <tr
                  className={`hover:bg-gray-700 cursor-pointer transition duration-300 ${
                    isExpanded ? 'bg-gray-800' : 'bg-gray-900'
                  }`}
                  onClick={onClickRow}
                  data-cy={clickableCY}
                >
                  {row.map((cell, index) => {
                    const { content, title, gridCol } = cell;
                    return (
                      <td
                        key={index}
                        className={`truncate px-4 py-2 text-base ${
                          !isExpanded ? 'border-gray-600 border-b' : ''
                        } ${`w-${gridCol}/12`}`}
                        style={{
                          maxWidth: 0,
                        }}
                        title={title}
                      >
                        <div className="flex">
                          {index === 0 && (
                            <div className="mr-4">
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                            </div>
                          )}
                          <div className="overflow-hidden truncate">{content}</div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
                {isExpanded && (
                  <tr className="max-h-0 w-full select-text overflow-hidden bg-black">
                    <td colSpan={row.length}>{expandedContent}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </td>
      </tr>
    </>
  );
}
