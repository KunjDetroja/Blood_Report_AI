import React from 'react';
import ReactMarkdown from 'react-markdown';
import LoadingGif from '../public/test.gif';

const Report = ({ loading, data }) => {

  if(loading) {
    return <div>
        <img src={LoadingGif} alt="Loading..." />
    </div>
  }
  return (
    <div className="blood-test-report">
        {
            data === undefined ? <h3>No data to display</h3> : null
        }
      <ReactMarkdown>{data}</ReactMarkdown>
    </div>
  );
};

export default Report;