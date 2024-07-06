import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import download from "js-file-download";
import creds from "../../creds";
import { useNavigate } from "react-router-dom";
import ContentLoader from "react-content-loader";
import { DomainDataTombstone } from "../../components/tombstones/DomainDataTombstone";
import { ToastContext } from "../../App";
import { TOAST_VARIANTS } from "../../packages/toasts/constants";
import { Heading } from "../../components/styled/Text";

// const url= creds.backendUrl;
const url = creds.backendUrl;

export default function DomainData({ domain }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  // const [hidden, setHidden] = useState(false);

  const { addToast } = useContext(ToastContext);

  const isLoggedIn = !!localStorage.getItem("dfs-user");
  const [data, setData] = useState([]);
  useEffect(() => {
    setLoading(true);
    const role = JSON.parse(localStorage.getItem("dfs-user")).user.user_role;
    axios
      .get(url + "datasets", { params: { domain,role } })
      .then((data) => {
        // console.log("DATA", domain, data);
        setData(data.data.data);
        console.log("DATA", data.data.data);
      })
      .catch((err) => {
        // console.log("ERR", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [domain]);

  const  handledelete = (dataset_id) => {
    console.log("delete");
    console.log(JSON.parse(localStorage.getItem("dfs-user")));
    return () => {
      axios
        .post(url + "data-delete/" + dataset_id, {
          headers: {
            Authorization: "Bearer " + JSON.parse(localStorage.getItem("dfs-user"))["token"],
          },
        })
        .then((res) => {
          console.log(res);
          addToast({
            message: "Dataset Deleted",
            variant: TOAST_VARIANTS.SUCCESS,
          });
          // navigate("/datasets");
          // window.location.reload(false);
        })
        .catch((err) => {
          console.log(err);
          addToast({
            message: "Error Deleting Dataset",
            variant: TOAST_VARIANTS.ERROR,
          });
        });
    };
  };
  const handlehide = (dataset_id) => {
    console.log("hide");
    console.log(JSON.parse(localStorage.getItem("dfs-user")));
    return () => {
      axios
        .post(url + "data-hide/" + dataset_id, {
          headers: {
            Authorization: "Bearer " + JSON.parse(localStorage.getItem("dfs-user"))["token"],
          },
        })
        .then((res) => {
          console.log("sannidhya");
          // console.log(typeof(res.data.message));
          const hidd = res.data.message;
          addToast({
            message: hidd,
            variant: TOAST_VARIANTS.SUCCESS,
          });
          // navigate("/datasets");
          // window.location.reload(false);
        })
        .catch((err) => {
          console.log(err);
          addToast({
            message: "Error Hiding Dataset",
            variant: TOAST_VARIANTS.ERROR,
          });
        });
    };
  };
  

  if(!loading && data.length === 0){
    return <Heading size="2" className="text-red-900 text-center">No verified public datasets visible for above domain</Heading>
  }

  return (
    <>
      {/* console.log(data); */}
      {loading ? (
        [1, 2, 3].map((k) => (
          <DomainDataTombstone key={k}/>
        ))
      ) : data.map((dataset, index) => (
        <div
          class="max rounded overflow-hidden shadow-2xl hover:shadow-3xl text-center mb-8"
          key={index}
        >
          <div class="px-6 py-4">
            <div class="font-bold text-3xl mb-4">{dataset.dataset_name}</div>
            <p class="text-gray-700 text-base mb-4 text-justify">
              {dataset.dataset_description && dataset.dataset_description.split('Π').map((data) => (<p className="mb-2">{data}</p>))}
            </p>
            {(dataset.source.includes('http') || dataset.source.includes('www')) ? <a class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full m-1"
              href={dataset.source}
            >
              Source
            </a> : null}
            <a
              class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full m-1"
              href={"/dataset-versions/" + dataset.dataset_id}
            >
              Details
            </a>
            {JSON.parse(localStorage.getItem("dfs-user")).user.user_role == 'admin' ? (
            <button class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-full m-1 mt-2" 
              onClick={handledelete(dataset.dataset_id)}
            >
              Delete
            </button>
               ) : null}  
            {JSON.parse(localStorage.getItem("dfs-user")).user.user_role == 'admin' ? (
            <button class="bg-red-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-full m-1 mt-2" 
              onClick={handlehide(dataset.dataset_id)}
            >
              ToggleHide
            </button>
               ) : null}

            <button
              class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-full m-1 mt-2"
              onClick={() => {
                if (!isLoggedIn) {
                  addToast({
                    message: "Sign In Required to Download",
                    variant: TOAST_VARIANTS.ERROR
                });
                }
                else {
                  window.location.href = url + "request-new-dataset?datasetid=" + dataset.dataset_id + "&token=" + (isLoggedIn ? JSON.parse(localStorage.getItem("dfs-user"))["token"] : null);
                }
              }}
            >
              Download
            </button>
          </div>
        </div>
      ))}
    </>
  );
}
