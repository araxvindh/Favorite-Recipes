import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import { db } from './firebase.js';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import './App.css';
import Recipe from './components/Recipe.jsx';

// Firebase query to fetch recipes, ordered by timestamp
const q = query(collection(db, 'recipe'), orderBy('timestamp', 'desc'));

function App() {
    const [recipes, setRecipes] = useState([]);
    const [titleInput, setTitleInput] = useState('');
    const [descInput, setDescInput] = useState('');

    // Fetch recipes from Firestore on component mount and when data changes
    useEffect(() => {
        onSnapshot(q, (snapshot) => {
            setRecipes(snapshot.docs
                .filter(doc => !doc.data().deleted) // Filter out deleted recipes
                .map(doc => ({
                    id: doc.id,
                    item: doc.data()
                })));
        });
    }, []);

    // Function to add a new recipe to Firestore
    const addRecipe = (e) => {
        e.preventDefault();
        addDoc(collection(db, 'recipe'), {
            title: titleInput,
            description: descInput,
            timestamp: serverTimestamp()
        });
        setTitleInput('');
        setDescInput('');
    };

    // Function to update an existing recipe in Firestore
    const updateRecipe = async (id, newTitle, newDescription) => {
        const recipeRef = doc(db, 'recipe', id);
        await updateDoc(recipeRef, {
            title: newTitle,
            description: newDescription,
        });
    };

    // Function to delete a recipe from Firestore
    const deleteRecipe = async (id) => {
        const recipeRef = doc(db, 'recipe', id);
        await deleteDoc(recipeRef); // Use deleteDoc to completely remove the document
    };

    return (
        <div className="App">
            <h2>Favorite Recipes</h2>
            {/* Form to add a new recipe */}
            <form onSubmit={addRecipe}>
                <TextField
                    label="Recipe Title"
                    variant="outlined"
                    size="small"
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Recipe Description"
                    variant="outlined"
                    size="small"
                    value={descInput}
                    onChange={(e) => setDescInput(e.target.value)}
                    fullWidth
                    multiline
                    rows={4}
                />
                <Button variant="contained" color="primary" type="submit">
                    Add Recipe
                </Button>
            </form>

            {/* List of recipes */}
            <ul className="recipe-list">
                {recipes.map((item) => (
                    <Recipe
                        key={item.id}
                        arr={item}
                        updateRecipe={updateRecipe}
                        deleteRecipe={deleteRecipe}
                    />
                ))}
            </ul>
        </div>
    );
}

export default App;
