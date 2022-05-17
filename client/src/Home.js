import React, { useState } from 'react'
import axios from 'axios'

const baseUrl = "http://localhost:5000/api/url/short"
const headers = {
  'Content-Type': 'application/json',
  "Access-Control-Allow-Origin": "*"
}

function Home() {
  const [url, setUrl] = useState('')
  const [urlData, setUrlData] = useState('')
  const [flag, setFlag] = useState(false)

  function shortenUrl() {
    // POST request to shorten the URL
    axios
      .post(baseUrl, {
        originalUrl: url
      }, headers)
      .then((response) => {
        setUrlData(response.data)
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
        setFlag(true)
        setUrlData(error.response.data)
      })
  }

  const handleSubmit = event => {
    event.preventDefault();
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
          <label> Enter URL: 
            <input
              name="url"
              value={url}
              type="text"
              onChange={(e) => setUrl(e.target.value)}
              />
          </label>
        <button onClick={shortenUrl}>Submit</button>
      </form>
      <hr />
      <br/>
      { flag ? <p>{urlData}</p> : <a href={urlData} target="_blank" rel="noreferrer">{urlData}</a> }
    </div>
  )
}

export default Home