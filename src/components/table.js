import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import InputField from './inputField';
import Button from './button';
import { FaBeer } from "react-icons/fa";

const Table = ({
  limit,
  tableData,
  tableHead,
  renderData,
  renderHead,
  tableTitle,
  search,
  createButtonHandler,
  importButtonHandler,
  assignButtonHandler,
}) => {
  let pages = 1;
  let range = [];

  const [dataShow, setDataShow] = useState(limit && tableData ? tableData.slice(0, Number(limit)) : tableData);
  const [currPage, setCurrPage] = useState(0);

  useEffect(() => {
    setDataShow(limit && tableData ? tableData.slice(0, Number(limit)) : tableData);
  }, [limit, tableData]);

  if (limit !== undefined) {
    let page = Math.floor(tableData.length / Number(limit));
    pages = tableData.length % limit === 0 ? page : page + 1;
    range = [...Array(pages).keys()];
  }

  const selectPage = (page) => {
    const start = limit * page;
    const end = start + limit;

    setDataShow(tableData.slice(start, end));

    setCurrPage(page);
  };

  const nextPage = () => {
    const start = limit * (currPage + 1);
    const end = start + limit;
    setDataShow(tableData.slice(start, end));
    setCurrPage((prev) => prev + 1);
  };

  const prevPage = () => {
    const start = limit * (currPage - 1);
    const end = start + limit;
    setDataShow(tableData.slice(start, end));
    setCurrPage((prev) => prev - 1);
  };

  const debounce = (func, wait) => {
    let timeout;
    return function (...args) {
      const context = this;
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        timeout = null;
        func.apply(context, args);
      }, wait);
    };
  };

  const searchWithDebounce = debounce(search, 1000);

  return (
    <section className='antialiased text-gray-600 mt-20 px-4 rounded-xl'>
      <div className='flex flex-col justify-center h-full rounded-xl'>
        <div className='w-full mx-auto bg-white shadow-lg rounded-sm border border-gray-200'>
          <header className='px-5 py-4 border-b border-gray-100'>
            <h2 className='font-semibold text-gray-800'>{tableTitle}</h2>
            <div className='w-full flex justify-between'>
              {search && (
                <InputField
                  type='text'
                  placeholder='Search...'
                  onChange={(e) => searchWithDebounce(e.target.value)}
                  className='w-[80px] sm:w-1/5 rounded-md mt-1 border-gray-300'
                />
              )}
              <div className='w-fit flex gap-3 justify-around items-center'>
                {assignButtonHandler && (
                  <Button icon={FaBeer} title='Assign' type='secondary' onClick={assignButtonHandler} />
                )}
                {importButtonHandler && (
                  <Button icon={FaBeer} title='Import' type='success' onClick={importButtonHandler} />
                )}
                {createButtonHandler && (
                  <Button icon={FaBeer} title='Create' type='primary' onClick={createButtonHandler} />
                )}
              </div>
            </div>
          </header>
          <div className='p-3'>
            <div className='overflow-x-auto'>
              <table className='table-auto w-full'>
                <thead className='text-xs font-semibold uppercase text-white bg-gray-700'>
                  <tr>{tableHead && renderHead ? tableHead.map((item, index) => renderHead(item, index)) : null}</tr>
                </thead>
                <tbody className='text-sm divide-y divide-gray-100'>
                  {dataShow.length > 0 && renderData ? dataShow.map((item, index) => renderData(item, index)) : null}
                </tbody>
              </table>
            </div>
          </div>
          {pages > 1 && (
            <div className='w-full overflow-x-scroll flex justify-end p-5'>
              <nav className='relative z-0 inline-flex rounded-md shadow-sm -space-x-px' aria-label='Pagination'>
                <button
                  onClick={prevPage}
                  disabled={currPage < 1 ? true : false}
                  className='relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50'
                >
                  <span className='sr-only'>Previous</span>
                  <FaBeer className='h-5 w-5' aria-hidden='true' />
                </button>
                {pages > 1 &&
                  range.map((item, index) => (
                    <button
                      key={index}
                      aria-current='page'
                      onClick={() => selectPage(index)}
                      className={`z-10 bg-indigo-50 ${
                        currPage === index && 'border-indigo-500 text-indigo-600'
                      } inline-flex items-center px-4 py-2 border-2 text-sm font-medium`}
                    >
                      {item + 1}
                    </button>
                  ))}
                <button
                  onClick={nextPage}
                  disabled={currPage >= range[range.length - 1] ? true : false}
                  className='relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50'
                >
                  <span className='sr-only'>Next</span>
                  <FaBeer className='h-5 w-5' aria-hidden='true' />
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

Table.propsType = {
  limit: PropTypes.number,
  tableData: PropTypes.array,
  tableHead: PropTypes.array,
  renderData: PropTypes.func,
  renderHead: PropTypes.func,
  tableTitle: PropTypes.string,
  search: PropTypes.func,
  createButtonHandler: PropTypes.func,
  importButtonHandler: PropTypes.func,
};

export default Table;
