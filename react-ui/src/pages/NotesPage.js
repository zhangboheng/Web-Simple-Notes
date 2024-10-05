import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import 'react-mde/lib/styles/css/react-mde-all.css';
import ReactMde from 'react-mde';
import { getNotesByUserId, createNote, updateNote, deleteNote } from '../services/auth';
import leftMove from '../assets/images/leftMove.png';
import rightMove from '../assets/images/rightMove.png';
import Tooltip from '@mui/material/Tooltip';

function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [markdownContent, setMarkdownContent] = useState('');
  const [title, setTitle] = useState('');
  const [selectedTab, setSelectedTab] = useState('write');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const userId = JSON.parse(userInfo)[0].id;
      getNotesByUserId(userId)
        .then(response => {
          setNotes(response.data);
          console.log('Notes fetched:', response.data);
        })
        .catch(error => console.error('Error fetching notes:', error));
    }
  }, []);

  const handleSelectNote = (note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setMarkdownContent(note.content);
  };

  const handleAddNote = () => {
    const userInfo = localStorage.getItem('userInfo');
    const userId = JSON.parse(userInfo)[0].id;
    const newNote = { userId: userId, title: 'New Note', content: '' };
    createNote({ userId, ...newNote })
      .then(response => {
        const createdNote = response.data;
        setNotes([...notes, response.data]);
        setSelectedNote(createdNote);
        console.log('New note added:', response.data); // Debugging log
      })
      .catch(error => console.error('Error creating note:', error));
  };

  const handleSaveNote = () => {
    if (selectedNote) {
      updateNote(selectedNote.noteId, { title: title, content: markdownContent })
        .then(response => {
          const updatedNotes = notes.map(note => (note.noteId === selectedNote.noteId ? response.data : note));
          setNotes(updatedNotes);
          setSelectedNote(updatedNotes);
          console.log('Note updated:', response.data); // Debugging log
        })
        .catch(error => console.error('Error updating note:', error));
    }
  };

  const handleDeleteNote = () => {
    if (selectedNote) {
      deleteNote(selectedNote.noteId)
        .then(() => {
          setNotes(notes.filter(note => note.noteId !== selectedNote.noteId));
          setSelectedNote(null); // Reset selected note
          console.log('Note deleted:', selectedNote.noteId); // Debugging log
        })
        .catch(error => console.error('Error deleting note:', error));
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Tooltip title="Toggle Sidebar">
        <IconButton
          onClick={toggleSidebar}
          sx={{ position: 'absolute', bottom: 10, left: 10, zIndex: 2 }}
        >
          <img src={isSidebarOpen ? leftMove : rightMove} alt="Toggle Sidebar" style={{ width: '24px', height: '24px' }} />
        </IconButton>
      </Tooltip>
      {isSidebarOpen && (
        <Box sx={{ width: '20%', borderRight: '1px solid #ccc', backgroundColor: '#000000' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2, flexShrink: 0, minWidth: 0 }}>
            <Typography variant="h5" sx={{ marginBottom: 2, color: 'white', whiteSpace: 'nowrap' }}>Note List</Typography>
            <Tooltip title="Add Note">
              <IconButton variant="contained" onClick={handleAddNote} sx={{
                marginBottom: 2,
                backgroundColor: 'white',
                color: 'black',
                '&:hover': {
                  backgroundColor: '#f0f0f0',
                  color: '#000',
                },
              }}>
                <AddIcon />
              </IconButton>
            </Tooltip>
          </Box>
          {notes.map((note, index) => (
            <Box
              key={note.noteId}
              sx={{
                marginBottom: 1,
                cursor: 'pointer',
                padding: 2,
                wordWrap: 'break-word',
                wordBreak: 'break-all',
                whiteSpace: 'normal',
                color: note.noteId === selectedNote?.noteId ? '#000' : '#fff',
                backgroundColor: note.noteId === selectedNote?.noteId ? '#f0f0f0' : 'transparent',
              }}
              onClick={() => handleSelectNote(note)}
            >
              {note.title}
            </Box>
          ))}
        </Box>
      )}

      <Box sx={{
        width: isSidebarOpen ? '80%' : 'calc(99% - 18px)',
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {selectedNote ? (
          <>
            <Box sx={{ marginBottom: 2, width: '100%', display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Tooltip title="Save Note">
                <IconButton color="info" onClick={handleSaveNote}>
                  <SaveIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Note">
                <IconButton color="error" onClick={handleDeleteNote}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Logout">
                <IconButton color='info' onClick={handleLogout}>
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </Box >
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <Box sx={{ width: '100%', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <ReactMde
                value={markdownContent}
                onChange={setMarkdownContent}
                selectedTab={selectedTab}
                onTabChange={setSelectedTab}
                generateMarkdownPreview={markdown =>
                  Promise.resolve(
                    <Box sx={{
                      overflow: 'auto',
                      maxWidth: '100%',
                      height: 'calc(100vh - 240px)',
                    }}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
                    </Box>
                  )
                }
                initialEditorHeight="calc(100vh - 220px)"
                heightUnits=""
              />
            </Box>
          </>
        ) : (
          <Typography variant="h6" sx={{ textAlign: 'center' }}>Please Choose A Note or Add One</Typography>
        )}
      </Box>
    </Box>
  );
}

export default NotesPage;
