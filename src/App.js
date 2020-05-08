import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './FirebseConfig';

firebase.initializeApp(firebaseConfig);

function App() {
  const [user ,setUser] = useState ({
    isSignedIn:false,
    name:'',
    email:'',
    photo:'',
    isvalid:false
   
     })
     const handleSignIn = () => {
       firebase.auth().signInWithPopup()
       .then(res =>{
         const {displayName ,photoURL ,email} =res.user
          console.log(displayName,photoURL,email);
         const singnedInUser ={
           isSignedIn:true,
           name:displayName,
           email:email,
           photo:photoURL
         }
         setUser(singnedInUser)
       })
       .catch(err =>{
         console.log(err)
         console.log(err.messege);
       })  
       } 
       const handleSignOut =() =>{
         firebase.auth().signOut()
         .then(res =>{
           const signOutUser =
           {
             singnedInUser:false,
             name:'',
             photo:'',
             email:'',
             error:'',
             exintingUser:false,
             password:''
           }
           setUser(signOutUser)
         })
         .catch(err =>{
         })   
     }
     const is_valid_email = email => /(.)@(.+){2,}\.(.+){2,}/.test(email);
     const hasnumber = input =>/\d/.test(input);
   
     const switchForm =e =>{
         const createdUser ={...user}
         createdUser.exintingUser= e.target.checked;
         setUser(createdUser);
     }
     
     const handleChange = e => {
       const newUserInfo ={
         ...user
       }
       //perform validation
       let isvalid =true;
   
       if (e.target.name ==="email"){
         isvalid=(is_valid_email(e.target.value))   
       }
       if (e.target.name ==="password"){
         isvalid =e.target.value.length>8 && hasnumber(e.target.value)
       }
       newUserInfo[e.target.name] =e.target.value;
       newUserInfo.isvalid =isvalid
         setUser(newUserInfo)
     }
     
     const CreateAccount =(event) =>{
       if(user.isvalid){
         firebase.auth().createUserWithEmailAndPassword(user.email ,user.password)
         .then(res =>{
           console.log(res);
           const createdUser ={...user}
           createdUser.isSignedIn =true;
           createdUser.error= '';
           setUser(createdUser);
         })
         .catch(err =>{
           console.log(err.messege);
           const createdUser ={...user}
           createdUser.isSignedIn =false;
           createdUser.error =err.message
           setUser(createdUser);
           
         })
       }
       event.preventDefault();
       event.target.reset();
     }
     const signInUser = event =>{
      
      if(user.isvalid){
        firebase.auth().signInWithEmailAndPassword(user.email ,user.password)
        .then(res =>{
          console.log(res);
          const createdUser ={...user}
          createdUser.isSignedIn =true;
          createdUser.error= '';
          setUser(createdUser);
        })
        .catch(err =>{
          console.log(err.messege);
          const createdUser ={...user}
          createdUser.isSignedIn =false;
          createdUser.error =err.message
          setUser(createdUser);
              
         })
        }
      
      event.preventDefault();
         event.target.reset();
         
       }
     
     return (
       <div className="App">
        {user.isSignedIn ? <button onClick={handleSignOut}>Sign Out</button>:<button onClick={handleSignIn}>Sign in</button>}
         {
         user.isSignedIn && <div><p> welcome:{user.name}</p>
         <p>your email:{user.email}</p>
         <img src={user.photo}alt=""/></div>
         }
         <h1>Our own authentication</h1>
         <input type="checkbox"  onChange ={switchForm}name="switchForm" id="switchForm"/>
         <label htmlFor="switchForn">
           Alredy have an account
         </label>
         
         <form  style={{display:user.exintingUser? 'block':'none'}} onSubmit ={signInUser}>
         <input type="text" onBlur={ handleChange}  name ="email"placeholder ="Your Email"  required/>
         <br/>
         <input type="password"onBlur={ handleChange} name ="password" placeholder ="Your Password"  required/>
         <br/>
         <input type="submit" value="Sign In "/>
         </form>
   
         <form  style={{display:user.exintingUser? 'none':'block'}} onSubmit ={CreateAccount}>
         <input type="text" onBlur={ handleChange}  name ="name"placeholder ="Your Name"  required/>
         <br/>
         <input type="text" onBlur={ handleChange}  name ="email"placeholder ="Your Email"  required/>
         <br/>
         <input type="password"onBlur={ handleChange} name ="password" placeholder ="Your Password"  required/>
         <br/>
         <input type="submit" value="Create Accuont"/>
         </form>
         {
           user.error && <p style={{color:"red"}}>{user.error}</p>
         }
         </div>
     ) 
};
   
export default App;
