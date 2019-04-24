import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {

  state = {
    data: [],
    id: 0,
    message: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null
  };

  componentDidMount() {
    console.log(this.getDataFromDb())
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({ intervalIsSet: interval });
    }
  }

  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }




  getDataFromDb = () => {
    fetch("http://localhost:3001/api/getData")
      .then(data => data.json())
      .then(res => this.setState({ data: res.data }));
  };


  putDataToDB = message => {
    let currentIds = this.state.data.map(data => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    axios.post("http://localhost:3001/api/putData", {
      id: idToBeAdded,
      message: message
    }).then(res => console.log(res.data));
  };


  deleteFromDB = idTodelete => {
    let objIdToDelete = null;
    this.state.data.forEach(dat => {
      if (dat.id == idTodelete) {
        console.log(idTodelete);
        objIdToDelete = dat._id;
      }
    });

    axios.delete("http://localhost:3001/api/deleteData", {
      data: {
        id: objIdToDelete
      }
    });
  };


  updateDB = (idToUpdate, updateToApply) => {
    let objIdToUpdate = null;
    this.state.data.forEach(dat => {
      if (dat.id == idToUpdate) {
        objIdToUpdate = dat._id;
      }
    });

    axios.post("http://localhost:3001/api/updateData", {
      id: objIdToUpdate,
      update: { message: updateToApply }
    });
  };


  render() {
    const { data } = this.state;
    const getValues = data.length ? data.map( (value, i) => {
      return(
        <li className='collection-item' key={i}>
          <i className="small material-icons">person</i>
          <span style={{ color: "gray" }}> id: {value.id}</span><br />
          <span style={{ color: "gray" }}> data: {value.message}</span>
        </li>)
    }) : (<p className='center'>No posts yet</p>);

    return (
      <div className='center container'>
        <ul className='collection'>
          <h4 className='section center darken-red'>Now I am a full stack developer</h4>
          {getValues}
        </ul>
        <div style={{ padding: "10px" }} className='card-content'>
          <input
            id="add-field"
            type="text"
            className="input-field"
            onChange={e => this.setState({ message: e.target.value })}
            placeholder="Enter a message"
            style={{ width: "200px" }}
          />
          <button
            onClick={() => this.putDataToDB(this.state.message)}
            ><i className="small material-icons">add_circle</i>
          </button>
        </div>
        <div style={{ padding: "10px" }} className='card-content'>
          <input
            type="text"
            style={{ width: "200px" }}
            onChange={e => this.setState({ idToDelete: e.target.value })}
            placeholder="Enter id to Delete"
          />
          <button
            style={{ paddingLeft: "10px" }}
            onClick={() => this.deleteFromDB(this.state.idToDelete)}
            ><i className="small material-icons">delete_forever</i>
          </button>
        </div>
        <div style={{ padding: "10px" }}>
          <span>
            <input
              type="text"
              style={{ width: "200px" }}
              onChange={e => this.setState({ idToUpdate: e.target.value })}
              placeholder="Id to update"
            />
        </span>
        <span> {} </span>
        <span>
          <input
            type="text"
            style={{ width: "200px" , paddingRight: "10px" }}
            onChange={e => this.setState({ updateToApply: e.target.value })}
            placeholder="Enter value to update"
          />
      </span>
          <button
            style={{ paddingLeft: "10px" }}
            onClick={() => this.updateDB(this.state.idToUpdate, this.state.updateToApply)}
            ><i className="small material-icons">edit</i>
          </button>
        </div>
      </div>
    );
  }
}

export default App;
