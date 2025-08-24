import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  CircularProgress,
  Alert,
  Chip,
  Card,
  CardContent,
} from '@mui/material';
import { Message as MessageIcon, Person as PersonIcon } from '@mui/icons-material';
import api, { ApiConversation } from '../services/api';

/**
 * ConversationsPage displays all conversations between users and guards with
 * real-time data from the backend API. Shows conversation participants,
 * message count, and last message timestamp with search and pagination.
 */
const ConversationsPage: React.FC = () => {
  const [conversations, setConversations] = useState<ApiConversation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const limit = 10;

  useEffect(() => {
    fetchConversations();
  }, [page, search]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.getConversations({
        page,
        limit,
        search: search || undefined,
      });
      setConversations(response.conversations);
      setTotalPages(response.totalPages);
      setTotal(response.total);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('Failed to load conversations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const formatParticipants = (participants: ApiConversation['participants']) => {
    return participants
      .map(p => `${p.first_name} ${p.last_name} (${p.role})`)
      .join(', ');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Conversations
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <TextField
          label="Search conversations..."
          value={search}
          onChange={handleSearchChange}
          sx={{ minWidth: 300 }}
        />
        <Typography variant="body2" sx={{ alignSelf: 'center' }}>
          Total: {total} conversations
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gap: 2, mb: 3 }}>
        {conversations.length === 0 ? (
          <Card>
            <CardContent>
              <Typography variant="h6" align="center" color="text.secondary">
                No conversations found
              </Typography>
              <Typography variant="body2" align="center" color="text.secondary">
                {search ? 'Try adjusting your search terms.' : 'No conversations available.'}
              </Typography>
            </CardContent>
          </Card>
        ) : (
          conversations.map((conversation) => (
            <Card key={conversation.id}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MessageIcon color="primary" />
                    Conversation #{conversation.id}
                  </Typography>
                  <Chip 
                    label={`${conversation.messageCount} messages`} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    <PersonIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                    Participants:
                  </Typography>
                  <Typography variant="body2">
                    {formatParticipants(conversation.participants)}
                  </Typography>
                </Box>

                {conversation.messages.length > 0 && (
                  <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Latest Message:
                    </Typography>
                    <Typography variant="body2">
                      {conversation.messages[0].body}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      by {conversation.messages[0].sender.first_name} {conversation.messages[0].sender.last_name} 
                      ({conversation.messages[0].sender.role})
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Created: {formatDate(conversation.created_at)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Last activity: {formatDate(conversation.lastMessageAt)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Box>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Box>
  );
};

export default ConversationsPage;