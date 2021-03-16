import React, {useEffect, useState} from 'react'
import axios from 'axios';
import './App.css';
import styled from 'styled-components';


const Button = styled.button`
font-family: sans-serif;
font-size: 1.3rem;
margin-top: 10px;
border: none;
border-radius: 5px;
background-color: orangered;
color: white;
padding: 10px;
transition: ease 0.5s all;
&:hover{
  background-color: blue;
}`

const Heading = styled.h2`
font-size: 30px;
font-weight: bold;
color: black;
text-align: center;
`

const Main = styled.div`
background-color: ${({primary}) =>(primary ? 'orange' : 'none')};
border-radius: 0.5rem;
width: 40%;
text-align:center;
`
const Input = styled.input`
border-radius: .5em;
width: 80%;
padding: 0.5em;
border: 1px solid gray;
`

const List = styled.li`
font-size: 20px;
font-family: sans-serif;
font-weight: bold;
color: ${({primary}) =>(primary ? 'black' : 'white')};
text-align:center;
padding: 0 20px 15px;
list-style: none;
`


function App() {
  const [apiUsers, setApiUsers] = useState({
    loading: false,
    users: []
  });
  const [list, setList ] = useState({
    currentUser: {
      name: "",
      email: ""
    }, 
    allUsers: []
  });
  const [error, setError] = useState();
  const [sortOrder, setSortOrder] = useState(true);

  const fetchUsers = async () => {
    setApiUsers({
      ...apiUsers,
      loading: true
    })

    const response = await axios.get('https://8ee41f94-d4f4-439d-8233-e573edca74ff.mock.pstmn.io/users');
    setApiUsers({
      loading: false,
      users: response.data.data
    });
  }
  
  useEffect(() => {
    fetchUsers();
  }, [])

  const displayApiUsers = apiUsers.users.map((user, index) => {
    return <ul>
            <List primary key={index}>Name: {user.name} </List>
            <List>Email: {user.email}</List>
          </ul>
  });

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(list.currentUser)
    canUserBeAddedToList(list.currentUser.email)
    
    if(canUserBeAddedToList(list.currentUser.email)) {
      setList({
        currentUser: {
          name: "", 
          email: ""
        },
        allUsers: [
          ...list.allUsers,
          list.currentUser
        ]
      })
    } else {

    }
  }

  const setCurrentUser = (e) => {
    if(error) {
      setError("")
    }
    setList({
      ...list,
      currentUser: {
        ...list.currentUser,
        [e.target.name]: e.target.value
      }
    })
  }

  const allUsers = list.allUsers.map((user, index) => {
    return <ul>
            <List primary key={index}>Name: {user.name}</List> 
            <List> Email: {user.email}</List>
          </ul>
  });

  const canUserBeAddedToList = (email) => {
    console.log(typeof email);
    const foundUserInApi = apiUsers.users.find(user => {
      return user.email === email
    })

    const foundUserInMyList = list.allUsers.find(user => {
      return user.email === email
    })

    if(foundUserInApi && !foundUserInMyList) {
      return true
    } else if(!foundUserInApi) {
      setError("User is not in the API list")
      return false
    } else {
      setError("User is already in my list")
      return false
    }
  }

  const sortUsers = (ascendingOrder) => {
    const usersSorted = list.allUsers.sort(function(a, b){
      if(ascendingOrder) {
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
      } else {
        if(a.name > b.name) { return -1; }
        if(a.name < b.name) { return 1; }
      }
      return 0;
    })

    setList({
      ...list,
      allUsers: [...usersSorted]
    })

    setSortOrder(!sortOrder);
    
  }


  return (
    <div className="container">
      <div className="title">
        <h1>API Users List</h1>
      </div>

      <div className="main">
      <Main primary>
        <form onSubmit={handleSubmit}> 
          <Heading>Enter Details</Heading>
          <Input 
            id="userName" 
            type="text" 
            name="name" 
            placeholder="Enter user name"
            onChange={setCurrentUser}
            value={list.currentUser.name}  
          />
          <br />
          <br />
          <Input 
            id="userEmail" 
            type="email" 
            name="email" 
            placeholder="Enter user email"
            onChange={setCurrentUser}
            value={list.currentUser.email} 
          /><br />
          <Button type="submit">Add user</Button>
        </form>
        
      
        {error && <h3>{error}</h3>}
        <Heading>My List</Heading>
        {/* <List primary>{allUsers}</List>   */}
        <List>{allUsers.length < 1 ? (
            <li><b>No users in the list</b></li>
            ) : allUsers }
          </List>
            
            { allUsers.length > 0 &&
              <Button className="btn" onClick={() => sortUsers(sortOrder)}>
                Sort users by name
              </Button>
            }
      </Main>

      <Main>
        <Heading>Api Users</Heading>
        
          {apiUsers.loading ? (
            <li className="loading">Loading Data...</li>
          ): displayApiUsers}
      </Main>
      </div>
    </div>
  );
}

export default App;
