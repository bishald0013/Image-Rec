import * as mobilenet from "@tensorflow-models/mobilenet";
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-cpu";
import { useEffect, useState, useRef } from "react";
import "./app.css";

function App() {
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [model, setModel] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);

  const imageRef = useRef();
  const textInput = useRef();

  const loadModel = async () => {
    setIsModelLoading(true);
    try {
      const model = await mobilenet.load();
      setModel(model);
      setIsModelLoading(false);
    } catch (error) {
      console.log(error);
      setIsModelLoading(false);
    }
  };

  const uploadImage = (e) => {
    const { files } = e.target;

    if (files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setImageURL(url);
    } else {
      setImageURL(null);
    }
  };

  const identify = async () => {
    textInput.current.value = "";
    const results = await model.classify(imageRef.current);
    setResults(results);
  };

  const handleOnChange = (e) => {
    setImageURL(e.target.value);
    setResults([]);
  };

  useEffect(() => {
    loadModel();
  }, []);

  useEffect(() => {
    if (imageURL) {
      setHistory([imageURL, ...history]);
    }
  }, [imageURL]);

  if (isModelLoading) {
    return (
      <div class="text-center mt-5 pt-5 loading">
      <div class="spinner-border text-light" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    );
  }

  return (
    <div className="App">
      <div className="container main-cont my-5">
        <h1 className="container text-center mt-5 text-white">
          Please put an image
        </h1>
        <h1 className="container text-center text-white">
          Upload any animal image to identify the name
        </h1>
        <div className="row">
          <div className="col-6 d-flex left-cont">
            <div className="container mx-5">
              <input
                type="file"
                accept="image/*"
                capture="camera"
                className="form-control bg-white bg-opacity-50 my-3 shadow-lg border border-white"
                onChange={uploadImage}
              />
              <input
                type="text"
                placeholder="Paste image URL"
                className="form-control bg-white bg-opacity-50 my-3 shadow-lg border border-white"
                ref={textInput}
                onChange={handleOnChange}
              />
              <div className="container">
                {history.length > 0 && (
                  <div className="recentPrediction">
                    <h2 className="text-white mt-3">Recent search</h2>
                    <div className="row">
                      {history.map((image, index) => {
                        return (
                          <div className="col-6">
                            <div
                              className="recentPred"
                              key={`${image}${index}`}
                            >
                              <img
                                src={image}
                                alt=""
                                className="w-50 my-3"
                                onClick={() => setImageURL(image)}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-6 right-cont">
            <div className="mainWrapper">
              <div className="mainContent">
                <div class="card my-5 bg-white bg-opacity-50 shadow-lg border border-white">
                  <div className="row">
                    <div className="col-6">
                      {imageURL && (
                        <img
                          className="card-img-top mt-2 ms-2"
                          src={imageURL}
                          alt="Upload"
                          crossOrigin="anonymous"
                          ref={imageRef}
                        />
                      )}
                    </div>
                    <div className="col-6">
                      <div class="card-body">
                        {results.length > 0 && (
                          <div className="resultsHolder">
                            {results.map((result, index) => {
                              return (
                                <div
                                  className="text-start fs-3 text-capitalize"
                                  key={result.className}
                                >
                                  <span className="fs-3 text-capitalize">
                                    {result.className}
                                  </span>
                                  <span className="confidence fs-5">
                                    {" "}
                                    Confidence level:{" "}
                                    {(result.probability * 100).toFixed(
                                      2
                                    )}%{" "}
                                    {index === 0 && (
                                      <span className="bestGuess">
                                        Best Guess
                                      </span>
                                    )}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    className="btn btn-dark bg-opacity-50 my-3 mx-5"
                    onClick={identify}
                  >
                    Identify Image
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
