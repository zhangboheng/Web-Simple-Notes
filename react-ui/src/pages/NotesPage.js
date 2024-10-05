import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Snackbar, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import LogoutIcon from '@mui/icons-material/Logout';
import Grow from '@mui/material/Grow';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import 'react-mde/lib/styles/css/react-mde-all.css';
import ReactMde from 'react-mde';
import { getNotesByUserId, createNote, updateNote, deleteNote } from '../services/auth';
import leftMove from '../assets/images/leftMove.png';
import { saveAs } from 'file-saver';
import rightMove from '../assets/images/rightMove.png';
import Tooltip from '@mui/material/Tooltip';

function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [markdownContent, setMarkdownContent] = useState('');
  const [title, setTitle] = useState('');
  const [selectedTab, setSelectedTab] = useState('write');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

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
          setSnackbarOpen(true);
        })
        .catch(error => console.error('Error updating note:', error));
    }
  };

  const handleDeleteNote = () => {
    setOpenDialog(true);
  };

  const confirmDeleteNote = () => {
    if (selectedNote) {
      deleteNote(selectedNote.noteId)
        .then(() => {
          setNotes(notes.filter(note => note.noteId !== selectedNote.noteId));
          setSelectedNote(null); // Reset selected note
          console.log('Note deleted:', selectedNote.noteId); // Debugging log
        })
        .catch(error => console.error('Error deleting note:', error));
    }
    setOpenDialog(false);
  };

  const cancelDeleteNote = () => {
    setOpenDialog(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleExportMarkdown = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    saveAs(blob, `${title || 'note'}.md`);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
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
          <Box sx={{
            flexGrow: 1,
            overflowY: 'auto',
            paddingBottom: 2,
            height: 'calc(100% - 120px)',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            '-ms-overflow-style': 'none',
            'scrollbar-width': 'none',
          }}>
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
            <Box sx={{ marginBottom: 2, width: '100%', display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
                <Tooltip title="Download Markdown">
                  <IconButton color="primary" onClick={handleExportMarkdown}>
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box>
                <Tooltip title="Logout">
                  <IconButton color='info' onClick={handleLogout}>
                    <LogoutIcon />
                  </IconButton>
                </Tooltip>
              </Box>
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
            <Dialog
              open={openDialog}
              onClose={cancelDeleteNote}
            >
              <DialogTitle>{"Confirm Delete"}</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Do you want to delete this note?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={cancelDeleteNote} color="primary">
                  Cancel
                </Button>
                <Button onClick={confirmDeleteNote} color="error" autoFocus>
                  Sure
                </Button>
              </DialogActions>
            </Dialog>
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={3000}
              onClose={handleCloseSnackbar}
              TransitionComponent={Grow}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                Save Success
              </Alert>
            </Snackbar>
          </>
        ) : (
          <Typography variant="h6" sx={{ textAlign: 'center' }}>Please Choose A Note or Add One</Typography>
        )}
      </Box>
    </Box>
  );
}

export default NotesPage;
