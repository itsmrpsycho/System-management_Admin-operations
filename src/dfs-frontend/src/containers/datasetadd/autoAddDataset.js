import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { ToastContext } from "../../App";
import { TOAST_VARIANTS } from "../../packages/toasts/constants";
import { MultiPageFormHeader } from "../../components/MultiPageFormHeader";
import dummyData from "./dummy";
import creds from "../../creds";
import AutoUploadfiles from "../fileuploads/autofileupload";
import { Heading, PlainText } from "../../components/styled/Text";
import { Button } from "../../components/styled/Buttons";
const url = creds.backendUrl;


// const axiosInstance = axios.create({ baseURL: "http://10.4.25.20:3001/" });
function create_UUID() {
  var dt = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
}

//     "dataset_id": "2328710d-e0c6-4fa8-b28a-265b4b6fa7d1",
//     "author_id": "amey.kudari@students.iiit.ac.in",
//     "reference_list": "https://dl.acm.org/doi/abs/10.1145/2827872,https://dl.acm.org/doi/fullHtml/10.1145/3458723",
//     "dataset_name": "Thar Desert Rain",
//     "dataset_description": "Rainfall statistics recorded across multiple regions and large timeframes in the Thar desert",
//     "public": 1,
//     "source": "IAF",
//     "dataset_data": null,
//     "dataset_format": "csv",
//     "temporary": 1,
//     "dataset_status": "REJECTED",
//     "domain": "Wildlife"

const updateDescription = (
  index,
  data,
  setDatasetDescription,
  datasetDescription
) => {
  const arr_desc = [...datasetDescription];
  setDatasetDescription(arr_desc, (arr_desc[index] = data));
};

const form_class =
  "w-2/3 align-end px-4 py-4 mx-4 my-3 border border-solid border-current rounded-lg bg-white shadow-2xl";

export default function AutoAddDataset() {
  // let user = JSON.parse(localStorage.getItem('dfs-user'));
  const [datasetId, setDatasetID] = useState(create_UUID());
  const [page, setPage] = useState('dataset');
  const authorId = JSON.parse(localStorage.getItem("dfs-user"))["user"][
    "user_email"
  ];
  const [referenceList, setReferenceList] = useState("");
  const [datasetName, setDatasetName] = useState("");
  const [datasetDescription, setDatasetDescription] = useState([""]);
  const [source, setSource] = useState("");
  const [datasetFormat, setDatasetFormat] = useState("");
  const [searchq, setSearchq] = useState("");
  const [domainLst, setDomainLst] = useState([]);
  const [domain, setDomain] = useState(""); // set existing domain for now
  const [loading, setLoading] = useState(false);
  const [uploadedDatasetId, setUploadedDatasetId] = useState(undefined);

  const { addToast } = useContext(ToastContext);

  useEffect(() => {
    axios
      .get(url + "domains", {
        params: { searchq },
      })
      .then((res) => {
        console.log(res);
        setDomainLst(res.data.data);
      });
  }, [searchq]);

  const submitHandler = () => {
    // e.preventDefault();
    const piSepDescArr = datasetDescription;
    piSepDescArr.map((s) => s.trim());
    piSepDescArr.filter(function (str) {
      return str !== "";
    });
    console.log(piSepDescArr);
    const piSepDescStr = piSepDescArr.join("Π");
    console.log(piSepDescStr);

    console.log("Before setting state:", dummyData.datasetName);
    // setDatasetName(dummyData.datasetName || "");
    console.log("After setting state:", datasetName);

    const payload = {
      datasetId,
      authorId,
      referenceList,
      datasetName,
      piSepDescStr,
      source,
      datasetFormat,
      domain,
    };
    let valid = true;
    // console.log("payload = ",payload);
    setLoading(true);
    Object.keys(payload).forEach((key) => {
      if (valid && payload[key] === "") {
        // addToast({
        //   message: "Please fill out all values, including: " + key,
        //   variant: TOAST_VARIANTS.WARNING,
        // });
        valid = false;
      }
    });
    if (valid) {
      axios
        .post(url + "add-dataset", payload, {
          headers: {
            Authorization:
              "Bearer " + JSON.parse(localStorage.getItem("dfs-user"))["token"],
          },
        })
        .then((res) => {
          if (res.data.error) {
            addToast({
              message: res.data.message,
              variant: TOAST_VARIANTS.ERROR,
            });
            setLoading(false);
          } else {
            setUploadedDatasetId(datasetId);
            setPage('file');
            addToast({
              message: "Dataset Details added successfully",
              variant: TOAST_VARIANTS.SUCCESS,
            });
            setLoading(false);
          }
        })
        .catch((err) => {
          addToast({
            message: "Server Error " + JSON.stringify(err),
            variant: TOAST_VARIANTS.ERROR,
          });
          setLoading(false);
        });
    }
    // if(valid)

  };
  useEffect(() => {
    // console.log("DATAESTNAME UPDATE");
    // console.log("After setting state:", datasetName);
    submitHandler();
  }, [datasetName]);

  useEffect(() => {
    if (dummyData) {
      setDatasetName(dummyData.datasetName || "");
      setReferenceList(dummyData.referenceList || "");
      setDatasetDescription(
        dummyData.datasetDescription ? [dummyData.datasetDescription] : [""]
      );
      
      setSource(dummyData.source || "");
      setDatasetFormat(dummyData.datasetFormat || "");
      setSearchq(dummyData.searchq || "");
      setDomain(dummyData.domain || "");
    }

  }, [dummyData]);

  return (
    <>
      <MultiPageFormHeader
        page={page}
        setPage={setPage}
        stepList={
        [
          {
            header: "Dataset Metadata",
            disabled: false,
            page: 'dataset',
          },
          {
            header: "Add Version",
            disabled: uploadedDatasetId ? false : true,
            page: 'file',
          },
        ]
      } />
      {page === 'dataset' ?
      <div className={form_class}>
        
      </div> :
        <AutoUploadfiles datasetId={uploadedDatasetId} isFirstDataset dataset_name={datasetName}/>
      }
    </>
  );
}


