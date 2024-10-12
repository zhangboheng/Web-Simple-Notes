import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Box, Typography, TextField, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Snackbar, Alert, useTheme, Slider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import LogoutIcon from '@mui/icons-material/Logout';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import HistoryIcon from '@mui/icons-material/History';
import Grow from '@mui/material/Grow';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import 'react-mde/lib/styles/css/react-mde-all.css';
import ReactMde from 'react-mde';
import { getNotesByUserId, createNote, updateNote, deleteNote, searchNotes, getNoteHistory } from '../services/auth';
import leftMove from '../assets/images/leftMove.png';
import { saveAs } from 'file-saver';
import rightMove from '../assets/images/rightMove.png';
import Tooltip from '@mui/material/Tooltip';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import '../assets/css/notepage.css'

function NotesPage({ colorMode }) {
  const theme = useTheme();
  const [notes, setNotes] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const [markdownContent, setMarkdownContent] = useState('');
  const [title, setTitle] = useState('');
  const [selectedTab, setSelectedTab] = useState('write');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [noteHistory, setNoteHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(0);


  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const userId = JSON.parse(userInfo)[0].id;
      getNotesByUserId(userId)
        .then(response => {
          const fetchedNotes = response.data;
          const sortedNotes = [...fetchedNotes].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
          setNotes(sortedNotes);
        })
        .catch(error => console.error('Error fetching notes:', error));
    }
  }, []);

  // Fetch note history when a note is selected
  useEffect(() => {
    if (selectedNote) {
      getNoteHistory(selectedNote.noteId)
        .then(response => {
          setNoteHistory(response.data); // Save history data
          setHistoryIndex(0); // Reset the slider to the latest history
        })
        .catch(error => console.error('Error fetching note history:', error));
    }
  }, [selectedNote]);

  useLayoutEffect(() => {
    const updateMdeToolbarColor = () => {
      const toolbar = document.querySelector('.mde-header');
      if (toolbar) {
        if (theme.palette.mode === 'light') {
          toolbar.classList.add('light-mode-toolbar');
          toolbar.classList.remove('dark-mode-toolbar');
        } else {
          toolbar.classList.add('dark-mode-toolbar');
          toolbar.classList.remove('light-mode-toolbar');
        }
      }
    };

    updateMdeToolbarColor();
  }, [theme.palette.mode, selectedNote]);

  const handleToggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleSelectNote = (note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setMarkdownContent(note.content);

    updateMdeToolbarColor();
  };

  const updateMdeToolbarColor = () => {
    const toolbar = document.querySelector('.mde-header');
    if (toolbar) {
      if (theme.palette.mode === 'light') {
        toolbar.classList.add('light-mode-toolbar');
        toolbar.classList.remove('dark-mode-toolbar');
      } else {
        toolbar.classList.add('dark-mode-toolbar');
        toolbar.classList.remove('light-mode-toolbar');
      }
    }
  };

  const handleAddNote = () => {
    const userInfo = localStorage.getItem('userInfo');
    const userId = JSON.parse(userInfo)[0].id;
    const newNote = { userId: userId, title: 'New Note', content: '' };
    createNote({ userId, ...newNote })
      .then(response => {
        const createdNote = response.data;
        const updatedNotes = [createdNote, ...notes];
        const sortedNotes = [...updatedNotes].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setNotes(sortedNotes);
        setSelectedNote(createdNote);
        setTitle(newNote.title);
        setMarkdownContent('');
      })
      .catch(error => console.error('Error creating note:', error));
  };

  const handleSearch = () => {
    const userInfo = localStorage.getItem('userInfo');
    const userId = JSON.parse(userInfo)[0].id;
    searchNotes(keyword.trim(), userId) // Call the backend search API
      .then(response => {
        const searchedNotes = response.data;
        const sortedNotes = [...searchedNotes].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setNotes(sortedNotes);
      })
      .catch(error => console.error('Error searching notes:', error));
  };

  const handleSaveNote = () => {
    if (selectedNote) {
      updateNote(selectedNote.noteId, { title: title, content: markdownContent })
        .then(response => {
          const updatedNote = response.data; // Get the updated note
          const updatedNotes = notes.map(note => (note.noteId === selectedNote.noteId ? response.data : note));
          const sortedNotes = [...updatedNotes].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
          setNotes(sortedNotes); // Update the list of notes
          setSelectedNote(updatedNote); // Set the updated note as selected
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
          setSelectedNote(null);
          setTitle('New Note');
          setMarkdownContent('');
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

  // Markdown File Export
  const handleExportMarkdown = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    saveAs(blob, `${title || 'note'}.md`);
  };

  // Handle slider change to show history content
  const handleSliderChange = (event, newValue) => {
    setHistoryIndex(newValue);
    if (noteHistory[newValue]) {
      setTitle(noteHistory[newValue].title); // Update title based on history
      setMarkdownContent(noteHistory[newValue].content); // Update content based on history
    }
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
            <Typography variant="h5" sx={{ marginBottom: 0, color: 'white', whiteSpace: 'nowrap' }}>Note List</Typography>
            <Tooltip title="Add Note">
              <IconButton variant="contained" onClick={handleAddNote} sx={{
                marginBottom: 0,
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
          <Box sx={{ padding: 1 }}>
            <TextField
              label="Search Notes"
              variant="outlined"
              fullWidth
              autoFocus={true}
              value={keyword}
              color="secondary"
              margin='none'
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }} // Search on Enter key
              InputProps={{
                endAdornment: (
                  <IconButton color='secondary' onClick={handleSearch}>
                    <SearchIcon />
                  </IconButton>
                ),
                style: { color: '#fff' }
              }}
              InputLabelProps={{
                style: { color: '#fff' } // Customize the label color (optional)
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#CCCCCC', // Default border color
                  },
                  '&:hover fieldset': {
                    borderColor: '#FFFFFF', // Border color when hovered
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FFFFFF', // Border color when focused
                  },
                },
              }}
            />
          </Box>
          <Box sx={{
            flexGrow: 1,
            overflowY: 'auto',
            paddingBottom: 2,
            height: 'calc(100% - 180px)',
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
        width: isSidebarOpen ? '80%' : '100%',
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {selectedNote ? (
          <>
            <Box sx={{ marginBottom: 2, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems:"center", gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}>
                  <IconButton onClick={handleToggleFullscreen}>
                    {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Toggle Mode">
                  <IconButton color="warning" onClick={colorMode.toggleColorMode}>
                    {theme.palette.mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
                  </IconButton>
                </Tooltip>
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
                  <IconButton color="success" onClick={handleExportMarkdown}>
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box>
                {noteHistory.length > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <HistoryIcon sx={{ marginRight: 1, color:"#FFD700" }} /> {/* Adjust color and margin as needed */}
                    <Slider
                      value={historyIndex}
                      onChange={handleSliderChange}
                      step={1}
                      marks
                      min={0}
                      max={noteHistory.length - 1}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(value) => {
                        const date = new Date(noteHistory[value]?.updatedAt);
                        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
                        
                        return formattedDate; // Return the formatted date
                      }}
                      sx={{
                        width: 200,
                        marginLeft: 2,
                        color: theme.palette.mode === 'light' ? '#000' : '#fff',
                        '& .MuiSlider-thumb': {
                          color: theme.palette.mode === 'light' ? '#000' : '#fff',
                        },
                        '& .MuiSlider-track': {
                          color: theme.palette.mode === 'light' ? '#000' : '#fff',
                        },
                        '& .MuiSlider-rail': {
                          color: theme.palette.mode === 'light' ? '#ccc' : '#fff',
                        },
                        '& .MuiSlider-mark': {
                          backgroundColor: theme.palette.mode === 'light' ? '#ccc' : '#fff',
                        },
                        '& .MuiSlider-valueLabel': {
                          top: 40, // Adjust this value as per your design to move the label below the slider
                          backgroundColor: 'transparent', // Optional: make the label background transparent
                          color: '#999', // Optional: change the label text color
                        },
                      }}
                    />
                  </Box>
                )}
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
              sx={{
                marginBottom: 2,
              }}
            />
            <Box sx={{
              width: '100%',
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#121212',
              color: theme.palette.mode === 'light' ? '#000' : '#fff',
            }}>
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
                childProps={{
                  writeButton: {
                    style: {
                      backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#121212',
                      color: theme.palette.mode === 'light' ? '#000' : '#fff',
                    }
                  },
                  previewButton: {
                    style: {
                      backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#121212',
                      color: theme.palette.mode === 'light' ? '#000' : '#fff',
                    }
                  },
                  commandButtons: {
                    style: {
                      backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#121212',
                      color: theme.palette.mode === 'light' ? '#000' : '#fff',
                    }
                  },
                  textArea: {
                    style: {
                      backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#121212',
                      color: theme.palette.mode === 'light' ? '#000' : '#fff',
                      overflow: 'auto',
                      maxWidth: '100%',
                      height: 'calc(100vh - 220px)',
                    },
                  },
                }}
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
