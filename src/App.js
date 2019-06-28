import React from 'react';
import logo from './load.gif';
import debounce from "lodash.debounce";
import { Button, Modal } from 'react-bootstrap';
// import SearchField from 'react-search-field';
// import ModalDialog from 'react-bootstrap/ModalDialog'
// import './App.css';
// import ReactDOM from 'react-dom';
// import $ from 'jquery'

class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        error: false,
        isLoaded: false,
        hasMore: true,
        items: [],
        item:{},
        resultLength: 0,
        show: false
      };
      this.getUsers = this.getUsers.bind(this);
      this.handleShow = this.handleShow.bind(this);
      this.handleClose = this.handleClose.bind(this);
      this.Search     =  this.Search.bind(this);

      window.onscroll = debounce(() => {
        const {
          getUsers,
          state: {
            error,
            isLoaded,
            hasMore,
          },
        } = this;
  
      
  
        // Checks that the page has scrolled to the bottom
        if (
          window.innerHeight + document.documentElement.scrollTop
          === document.documentElement.offsetHeight
        ) {
          
         
          // console.log(document.documentElement.scrollTop,'',window.innerHeight, '', document.documentElement.offsetHeight)
          getUsers();
        }
          // Bails early if:
        // * there's an error
        // * it's already loading
        // * there's nothing left to load
        if (error || isLoaded || !hasMore) return;

      }, 100);
    }
    
  
    componentWillMount() {  

      this.getUsers();

    }

    
    getUsers(){
      if(this.state.resultLength === 150){
        alert("End of users catalog")
        return
      } 
      fetch("https://randomuser.me/api/?results=50")
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({
              isLoaded: true,
               items: result.results,
               resultLength: this.state.resultLength +  50
            });
            // console.log(this.state.resultLength)
          },
          (error) => {
            this.setState({
              isLoaded: true,
              error
            });
          }
        )
        // console.log(this.state.items)
    };
  
   
    handleShow= (id, login) =>{
      const arr = this.state.items;
      for (var index in arr){
        //  console.log(arr[index].id.value)
        if(arr[index].id.value === id && arr[index].login.username === login){
          this.setState({ item: arr[index],
                           show: true  });
         
        }
      }
      

      // this.setState({ show: true });
    }

    handleClose() {
        this.setState({ show: false });
      }; 
      
    Search(event){
    
      var filter, table, tr, td1,td2, i,txtValue ,txtValue1,txtValue2;
 
  filter = event.target.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
     td1 = tr[i].getElementsByTagName("td")[1];
     td2 = tr[i].getElementsByTagName("td")[2];
    
    if (td1 && td2) {
      txtValue1 = td1.textContent || td1.innerText;
      txtValue2 = td2.textContent || td2.innerText;
      txtValue = txtValue1 +' '+ txtValue2;
      console.log(txtValue);
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }       
  }
    }
   render() {

      const { error, isLoaded, items,item } = this.state;
     
      if (error) {
        return <div>Error: {error.message}</div>;
      } else if (!isLoaded) {
        return <div className="loader"><img alt='' src={logo}></img></div>;
      } else {
        
     return (

         <div >
          <input type='text' name='title'  onKeyUp={this.Search}/>
  <table className="table" id="myTable">
  <thead>
    <tr>
      <th scope="col">Picture</th>
      <th scope="col">First Name</th>
      <th scope="col">Last Name</th>
      <th scope="col">Username</th>
      <th scope="col">Email</th>
      <th scope="col">More Info</th>
    </tr>
  </thead>
  <tbody>
        {items.map(item => (
          
          <tr key={item.login.username}>
            <td><img alt='' src={item.picture.thumbnail}></img></td>
            <td>{item.name.first}</td>
            <td>{item.name.last}</td>
            <td>{item.login.username}</td>
            <td>{item.email}</td>
            <td><button className='btn btn-primary' onClick={() => this.handleShow(item.id.value,item.login.username)}>More Info</button></td>
          </tr>
            )
          )
          }
  </tbody>
</table>
<Modal show={this.state.show} onHide={this.handleClose}  dialogClassName="modal-90w">
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Street</th>
                <th scope="col">City</th>
                <th scope="col">State</th>
                <th scope="col">Postcode</th>
                <th scope="col">Phone</th>
                <th scope="col">Cell</th>
              </tr>
            </thead>
            <tbody>
                  
                  
              {Object.values(item).length ? <tr><td>{item.location.street}</td><td>{item.location.city}</td><td>{item.location.state}</td><td>{item.location.postcode}</td><td>{item.phone}</td><td>{item.cell}</td></tr> : {}}
                  
                    
             
                    
            </tbody>
          </table>
           

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={this.handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
</Modal>
</div>
          
        );
      }
    }
  }
export default App