import React from "react";
import { BiSort, BiSortDown, BiSortUp } from "react-icons/bi";
import { AiFillLock } from "react-icons/ai";
import moment from "moment";
import { Button } from "../../styled/Buttons";
import { Heading, PlainText } from "../../styled/Text";
import ExpandedDatasetDetails from "./ExpandedDatasetDetails";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function DatasetVersionsTable({
  versionData,
  sort,
  sortOrder,
  sortFunction,
  setmodalShow,
  setShowFileDetails,
  setTarget,
  expandedView,
  isLoggedIn,
}) {
  return (
    <table className="min-w-full leading-normal">
      <thead>
        <tr>
          <th
            className="px-3 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
            onClick={() => sortFunction("dataset_id")}
          >
            Version id{" "}
            {sort === "dataset_id" ? (
              sortOrder === "ASC" ? (
                <BiSortUp className="float-right" />
              ) : (
                <BiSortDown className="float-right" />
              )
            ) : (
              <BiSort className="float-right" />
            )}
          </th>
          <th
            className="px-3 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
            onClick={() => sortFunction("dataset_name")}
          >
            Version_name{" "}
            {sort === "dataset_name" ? (
              sortOrder === "ASC" ? (
                <BiSortUp className="float-right" />
              ) : (
                <BiSortDown className="float-right" />
              )
            ) : (
              <BiSort className="float-right" />
            )}
          </th>
          <th
            className="px-3 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
            onClick={() => sortFunction("public")}
          >
            Version Format{" "}
            {sort === "public" ? (
              sortOrder === "ASC" ? (
                <BiSortUp className="float-right" />
              ) : (
                <BiSortDown className="float-right" />
              )
            ) : (
              <BiSort className="float-right" />
            )}
          </th>
          <th
            className="px-3 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
            onClick={() => sortFunction("source")}
          >
            Last Edit{" "}
            {sort === "source" ? (
              sortOrder === "ASC" ? (
                <BiSortUp className="float-right" />
              ) : (
                <BiSortDown className="float-right" />
              )
            ) : (
              <BiSort className="float-right" />
            )}
          </th>
          <th
            className="px-3 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
            onClick={() => sortFunction("dataset_status")}
          >
            Created Date{" "}
            {sort === "dataset_status" ? (
              sortOrder === "ASC" ? (
                <BiSortUp className="float-right" />
              ) : (
                <BiSortDown className="float-right" />
              )
            ) : (
              <BiSort className="float-right" />
            )}
          </th>
          <th
            className="px-3 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
            onClick={() => sortFunction("dataset_description")}
          >
            Description{" "}
            {sort === "dataset_description" ? (
              sortOrder === "ASC" ? (
                <BiSortUp className="float-right" />
              ) : (
                <BiSortDown className="float-right" />
              )
            ) : (
              <BiSort className="float-right" />
            )}
          </th>
          <th className="px-3 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Status
          </th>
          <th className="px-3 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {versionData.map((data, index) => (<>
          <tr>
            <td className="px-3 py-3 bg-white text-sm">
              <p className="text-gray-900 whitespace-no-wrap flex align-center">
                <span title={data.dataset_version_id}>
                  {data.databaseVersion_id.split("-")[0] + "-.."}
                </span>{" "}
                &nbsp;
                <svg
                  className="w-5 h-5 cursor-pointer"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path>
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path>
                </svg>
              </p>
            </td>
            <td className="px-3 py-3 bg-white text-sm">
              <p className="text-gray-900 whitespace-no-wrap">
                {data.version_name}
              </p>
            </td>
            <td className="px-3 py-3 bg-white text-sm">
              <p className="text-gray-900 whitespace-no-wrap">
                {data.filetype}
              </p>
            </td>
            <td className="px-3 py-3 bg-white text-sm">
              <p className="text-gray-900 whitespace-no-wrap">
                {moment(Number(data.last_edit)).format(
                  "DD/MM/YYYY (on hh:mm:ss A)"
                )}
              </p>
            </td>
            <td className="px-3 py-3 bg-white text-sm">
              <p className="text-gray-900 whitespace-no-wrap">
                {moment(Number(data.created_date)).format(
                  "DD/MM/YYYY (on hh:mm:ss A)"
                )}
              </p>
            </td>
            <td className="px-3 py-3 bg-white text-sm">
              <p
                className="text-gray-900 whitespace-no-wrap text-ellipsis"
                title={data.abstract}
              >
                {data.comments.slice(0, 20)}...
              </p>
            </td>
            <td className="px-3 py-3 bg-white text-sm">
              <p
                className="text-gray-900 whitespace-no-wrap text-ellipsis"
                title={data.abstract}
              >
                {capitalizeFirstLetter(data.verification)}
              </p>
            </td>
            <td className="px-3 py-3 bg-white text-sm flex h-full gap-0.5">
              {isLoggedIn ? <>
              <Button.Yellow
                onClick={() => {
                  // if(data.upfilename === expandedView){
                  // setExpandedView(currentFilename => currentFilename === data.upfilename ? '' : data.upfilename);
                  // }
                  setTarget(data);
                  setmodalShow(true);
                  setShowFileDetails(true);
                }}
                disabled={!isLoggedIn}
              >
                {expandedView === data.upfilename ? 'Shrink' : 'View'}
              </Button.Yellow>
              <Button.Red
                className="flex items-center"
                onClick={() => {
                  setTarget(data);
                  setmodalShow(true);
                  setShowFileDetails(false);
                }}
                disabled={!isLoggedIn}
                title={
                  data.public === "public"
                    ? undefined
                    : "Private Dataset"
                }
              >
                {data.public === "public" ? null : (
                  <AiFillLock className="text-yellow-500" />
                )}
                Download
              </Button.Red>
              </> : <PlainText className="text-red-500">Login Required</PlainText>}
            </td>
          </tr>
          {data.upfilename === expandedView ? (<tr>
            <td colspan="8" className=" px-4 pb-6 border-b border-slate-200">
              <hr />
              <Heading size="1">Description</Heading>
              <ExpandedDatasetDetails targetElement={data} />
            </td>
          </tr>) : null}
        </>)
        )}
      </tbody>
    </table>
  )
}

export default DatasetVersionsTable;