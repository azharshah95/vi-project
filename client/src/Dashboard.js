import React, { useState, useEffect } from 'react'
import Table from 'react-bootstrap/Table'
import Alert from 'react-bootstrap/Alert'
import axios from 'axios'

// keeping it here for now, can be later moved to a .env or config file
const baseUrl = "http://localhost:5000/api/url/"
const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyODJlZWY4ZGEwOWRhYTM5YTFkZmIwZCIsIm5hbWUiOiJhZG1pbiIsImlhdCI6MTY1Mjc5MzU1MCwiZXhwIjoxNjUyNzk0NDUwfQ.gn6vTZxk0oszV2FzQ2x_hnMy0D5ehtlWdlB48STn_94"

const headers = {
  'Content-Type': 'application/json',
  "Access-Control-Allow-Origin": "*",
  "Authorization": `Bearer ${authToken}`
}

function Dashboard() {

  const [urlList, setUrlList] = useState([])  // store URLs 
  const [errMessage, setErrMessage] = useState('')  // store Error

  useEffect(() => {

    const getAllUrl = async () => {
      await axios
        .get(baseUrl, { headers })
        .then((response) => {
          console.log(response.data);
          setUrlList(response.data)
        })
        .catch(error => {
          console.log(error)
          setErrMessage(error.response.data)
        })
    }

    getAllUrl()
      .catch(console.error)
  }, [])



  return (
    <div>
      Dashboard
      <p>{errMessage ? <Alert variant='danger'>{errMessage}</Alert> : ''}</p>
      <div>
        <Table responsive="sm" striped bordered hover>
          <thead>
            <tr>
              <th>UserID</th>
              <th>Original URL</th>
              <th>Short URL</th>
              <th>Url Code</th>
              <th>Hits</th>
              <th>Requests</th>
            </tr>
          </thead>
          <tbody>
            {urlList.map((url, index) => (
              <tr key={url._id}>
                <td>{url.user}</td>
                <td style={{ width: '20%' }}>
                  <a href={url.originalUrl} target="_blank" rel="noreferrer">{url.originalUrl}</a>
                </td>
                <td><a href={url.shortUrl} target="_blank" rel="noreferrer">{url.shortUrl}</a></td>
                <td>{url.urlCode}</td>
                <td>{url.hits}</td>
                <td>{url.requests}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  )
}

export default Dashboard