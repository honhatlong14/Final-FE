// import {useState} from "react";
//
// export default function PaginatedItems({ itemsPerPage, items }) {
//
//     // Here we use item offsets; we could also use page offsets
//     // following the API or data you're working with.
//     const [itemOffset, setItemOffset] = useState(0);
//
//     // Simulate fetching items from another resources.
//     // (This could be items from props; or items loaded in a local state
//     // from an API endpoint with useEffect and useState)
//     const endOffset = itemOffset + itemsPerPage;
//     console.log(`Loading items from ${itemOffset} to ${endOffset}`);
//     const currentItems = items.slice(itemOffset, endOffset);
//     const pageCount = Math.ceil(items.length / itemsPerPage);
//
//     // Invoke when user click to request another page.
//     const handlePageClick = (event) => {
//         const newOffset = (event.selected * itemsPerPage) % items.length;
//         console.log(
//             `User requested page number ${event.selected}, which is offset ${newOffset}`
//         );
//         setItemOffset(newOffset);
//     };
//
//     return (
//         <>
//             <RenderViewBookPage currentItems={currentItems}></RenderViewBookPage>
//             <ReactPaginate
//                 breakLabel="..."
//                 nextLabel=">"
//                 onPageChange={handlePageClick}
//                 pageRangeDisplayed={5}
//                 pageCount={pageCount}
//                 previousLabel="<"
//                 renderOnZeroPageCount={null}
//
//                 containerClassName= "flex items-center gap-2 justify-center my-3"
//                 pageLinkClassName="mx-1 flex h-9 w-9 items-center justify-center rounded-full border border-blue-gray-100 bg-transparent p-0 text-sm text-blue-gray-500 transition duration-150 ease-in-out hover:bg-light-300"
//                 previousLinkClassName="mx-1 flex h-9 w-9 items-center justify-center rounded-full border border-blue-gray-100 bg-transparent p-0 text-sm text-blue-gray-500 transition duration-150 ease-in-out hover:bg-light-300"
//                 nextLinkClassName="mx-1 flex h-9 w-9 items-center justify-center rounded-full border border-blue-gray-100 bg-transparent p-0 text-sm text-blue-gray-500 transition duration-150 ease-in-out hover:bg-light-300"
//                 activeLinkClassName="mx-1 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-pink-600 to-pink-400 p-0 text-sm text-white shadow-md shadow-pink-500/20 transition duration-150 ease-in-out"
//             />
//         </>
//     );
// }