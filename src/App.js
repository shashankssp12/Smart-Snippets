import { useEffect, useState } from "react";
import "./style.css"
import supabase from './supabase'

const CATEGORIES = [
  { name: "technology", color: "#3b82f6" },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
];


const initialFacts = [
  {
    id: 1,
    text: "React is being developed by Meta (formerly facebook)",
    source: "https://opensource.fb.com/",
    category: "technology",
    votesInteresting: 24,
    votesMindblowing: 9,
    votesFalse: 4,
    createdIn: 2021,
  },
  {
    id: 2,
    text: "Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%",
    source:
      "https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids",
    category: "society",
    votesInteresting: 11,
    votesMindblowing: 2,
    votesFalse: 0,
    createdIn: 2019,
  },
  {
    id: 3,
    text: "Lisbon is the capital of Portugal",
    source: "https://en.wikipedia.org/wiki/Lisbon",
    category: "society",
    votesInteresting: 8,
    votesMindblowing: 3,
    votesFalse: 1,
    createdIn: 2015,
  },
];

function App(){
  localStorage.setItem("name","Shashank");
  console.log(localStorage.getItem("name") );//key
 
  // 1.Define state variable
  const [showForm,setShowForm]=useState(false);
  const [facts,setFacts] = useState([]);
  const [isLoading,setIsLoading]=useState(false);
  const [currentCategory, setCurrentCategory]=useState("all");
  let query= supabase.from('facts')
  .select('*');
  
  if(currentCategory!=="all")
  query=query.eq("category",currentCategory);

useEffect(function(){ 
  async function getFacts(){
    setIsLoading(true);
    const { data: facts, error } = await query //supabase
    // .from('facts')
    // .select('*')
    // // .select('id') 
    // .eq('category','technology')//Equals
    .order("votesInteresting",{ascending:false})
    .limit(1000);
    
    if(!error)setFacts(facts);
else alert("There was an error while fetching the data.")
setIsLoading(false);
// console.log(facts);
}
getFacts();
},[currentCategory]);


return (    
  <>
    <Header showForm={showForm} setShowForm={setShowForm}/>
    
{/* 2.Use State variable*/}
{showForm?<NewFactForm setFacts={setFacts} setShowForm={setShowForm}/>: null}
<main className="main">
<CategoryFilter setCurrentCategory={setCurrentCategory}/>{/* Accepting the props */}
  {isLoading? <Loader/>:<FactsList facts={facts} setFacts={setFacts}/>}
</main>
</>
);
}

function Loader(){
  return <p className="message" >Loading...</p>;
}
function Header({showForm,setShowForm}){
  {/* Header */}
  const appTitle="Smart Snipppets"
  return (
  <header className="header">
  <div className="logo">
       <img src="logo.png" alt="Logo_img" height="68"/>
       <h1>{appTitle}</h1>
  </div>

 <button className="btn btn-large btn-open"
 //3.Update state variable
 onClick={()=>setShowForm((show)=>!show) }>{showForm?"Close":"Share a fact"}
  </button>
</header>);
}

function Counter(){
  const [count,setCount]=useState(0);//useState is a preade function in react library-->import in thee beginning
  return(
    <div>
      
    <span style={{fontSize:'40px'}}>{count}</span>
    <button className="btn btn-large btn-open" onClick={()=>setCount((c)=>c+1)}>+1</button>//Updating the state here
    </div>
  );
}

function isValidHttpUrl(string) {
  let url;
  
  try {
    url = new URL(string);
  } catch (_) {
    return false;  
  }
  
  return url.protocol === "http:" || url.protocol === "https:";
}

function NewFactForm({setFacts,setShowForm}){
  
  const [text,setText]=useState("");
  const [source,setSource]=useState("");//"http://example.com"
  const [category,setCategory]=useState("");
  const textLength=text.length;
  const [isUploading,setIsUploading]=useState(false);
  
  
  
  async function handleSubmit(e){
    //1.Prevents from Reload
    e.preventDefault();//prevents page from getting reloaded when post button is clicked
    console.log(text,source,category);
    
    //2.Check if the data is valid, if so --create fact
    //Using concept of falsy values
  if(text&& isValidHttpUrl(source)&&category&&textLength<=200)
  {
    console.log("There is data");
    
    //3 Create a new fact object
    // const newFact={
      //   id: Math.round(Math.random()*100),
      //   text,
      //   source,
      //   category,
      //   votesInteresting: 0,
      //   votesMindblowing: 0,
      //   votesFalse: 0,
      //   createdIn: new Date().getFullYear(),
      // };
      //3.Upload the fact to supabase☠️☠️☠️☠️☠️VeryImportant
      setIsUploading(true);
    const{data:newFact ,error}= await supabase.from('facts').insert([{text,source,category}]).select();
    setIsUploading(false);


  //4 Add the new fact to the UI.Add the fact to state
  if(!error) setFacts((facts)=>[newFact[0] ,...facts]);//Unwrapping all the components of the array in the new array by "..."
  
  //5 Reset Input fields 
      setText("");
      setSource("");
      setCategory("");


  //6 Close the form
  setShowForm(false);
    }
}
 return ( 
  <form className="fact-form" onSubmit={handleSubmit}>
    {/* //1.Statement */}
  <input type="text" placeholder="Share a Fact here..." value={text} 
  onChange={(e)=>setText(e.target.value)} disabled={setIsUploading}
  />
            <span>{200-textLength}</span>
            {/* //2.Same Statement */}
            <input type="text" placeholder="Enter valid source..." value={source}
            onChange={(e)=>setSource(e.target.value)} disabled={setIsUploading}/
            >
           {/* //3.Same Statement */}
            <select value={category} onChange={(e)=>setCategory(e.target.value)}>


                <option value="">Choose Category</option>
                {CATEGORIES.map((cat)=>(<option key={cat.name} value={cat.name}>{cat.name.toUpperCase()}</option>) 
                )}
                {/* <option value="Technology">Technology</option> */}
                </select>
                <button className="btn btn-large" disabled={setIsUploading}>Post</button>
  </form>
  )}
/////

function CategoryFilter({setCurrentCategory}){
  return (
  <aside>
    <ul>
    <li className="category"><button className="btn btn-all-categories" onClick={()=>setCurrentCategory("all")}>All</button></li>


      {CATEGORIES.map((cat)=>(
       <li key={cat.name} className="category"> 
       <button className="btn btn-category" onClick={()=>setCurrentCategory(cat.name)}
       style={{backgroundColor:cat.color }}>
             {cat.name}
      </button>
      
      </li>))}
      
    </ul>
    </aside>
    );
}
function FactsList({ facts,setFacts })//Using props here as well
{
  //  const [facts,setFacts] = useState(initialFacts);
  if(facts.length===0)
  return <p className="message">
    No facts for this category yet!Be the First one to create✌️.
  </p>

  //else (without else it is working)
  return  (<section>
    <ul className="facts-list">
     { facts.map((fact)=>(
      <Fact key={fact.id}  fact ={fact} setFacts={setFacts}/>
     ))}
       <p>there are {facts.length} in the database.Add your fact!!</p>
 
    </ul>
  </section>
  )
 }

//
function Fact({fact,setFacts}){
  const [isUpdating,setIsUpdating]=useState(false);  
  const isDisputed=(fact.votesInteresting+fact.votesMindblowing)<fact.votesFalse;
  async function handleVote(columnName){
    
    setIsUpdating(true);
    
    const {data:updatedFact,error} = await supabase.from('facts').update({[columnName]:fact[columnName]+1})//updating the button vote count on spot 
    .eq("id",fact.id)//for updating the vote count in a particular fact
    .select();//(set in order)to update the fact in the array list according to no. of votes
    
    // setIsUpdating(false);

    if(!error)
    setFacts((facts)=>facts.map((f)=>(f.id===fact.id?updatedFact[0]:f)));
  }
// console.log(props); 
// const {factObj}=props;//Destructuring

  return <li  className="fact">
                        <p>
                          {isDisputed ? <span className="disputed">[💀DISPUTED]</span>:null}
                          {fact.text}
                            <a className="source" href={fact.source} target="_blank">(Source)</a>
                        </p>
                        <span className="tag" style={{backgroundColor:CATEGORIES.find((cate)=>cate.name === fact.category).color}}>{fact.category}</span>
                        <div className="vote-buttons">
                            <button onClick={()=>handleVote("votesInteresting")} disabled={isUpdating}>👍<strong>{fact.votesInteresting}</strong></button>
                            <button onClick={()=>handleVote("votesMindblowing")} disabled={isUpdating}>🤯<strong>{fact.votesMindblowing}</strong></button>
                            <button onClick={()=>handleVote("votesFalse")} disabled={isUpdating}>⛔️<strong>{fact.votesFalse}</strong></button>
                        </div>
                    </li>
                    
}
export default App;
