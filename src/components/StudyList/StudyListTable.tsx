// src/components/StudyList/StudyListTable.tsx
import { StudyListRow, TableData } from './StudyListRow';

interface StudyListTableProps {
  tableDataSource: TableData[];
  querying?: boolean;
}

export function StudyListTable({ tableDataSource, querying }: StudyListTableProps) {
  return (
    <div className="bg-black">
      <div className="container relative m-auto">
        <table className="w-full text-white">
          <tbody data-cy="study-list-results" data-querying={querying}>
            {tableDataSource.map((tableData, i) => {
              return <StudyListRow tableData={tableData} key={i} />;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
