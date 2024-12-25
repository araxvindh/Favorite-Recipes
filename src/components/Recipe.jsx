import React, { useState } from 'react';
import { List, ListItem, ListItemAvatar, ListItemText, Button, TextField } from '@mui/material';
import { db } from '../firebase.js';
import { doc, updateDoc } from 'firebase/firestore';

const Recipe = ({ arr, updateRecipe, deleteRecipe }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(arr.item.title);
    const [newDescription, setNewDescription] = useState(arr.item.description);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleSave = async () => {
        updateRecipe(arr.id, newTitle, newDescription);
        setIsEditing(false);
    };

    const handleDelete = async () => {
        deleteRecipe(arr.id);
    };

    return (
        <List className="recipe-list">
            <ListItem>
                <ListItemAvatar />
                {isEditing ? (
                    <>
                        <TextField
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            label="Edit Title"
                            variant="outlined"
                            fullWidth
                        />
                        <TextField
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            label="Edit Description"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            style={{ marginTop: '10px' }}
                        />
                    </>
                ) : (
                    <>
                        <ListItemText primary={arr.item.title} />
                        <ListItemText secondary={arr.item.description} />
                    </>
                )}
                <Button variant="contained" color="primary" onClick={handleEditToggle}>
                    {isEditing ? 'Cancel' : 'Edit'}
                </Button>
                {isEditing ? (
                    <Button variant="contained" color="secondary" onClick={handleSave}>
                        Save
                    </Button>
                ) : (
                    <Button variant="contained" color="error" onClick={handleDelete}>
                        Delete
                    </Button>
                )}
            </ListItem>
        </List>
    );
};

export default Recipe;
