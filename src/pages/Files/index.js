import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { Container } from '../../styles/global';
import Loading from '../../components/Loading';
import { Title, Form } from './styles';
import axios from '../../services/axios';
import history from '../../services/history';
import * as actions from '../../store/modules/auth/actions';

export default function Files({ match }) {
  const dispatch = useDispatch();
  const id = get(match, 'params.id', '');

  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState('');

  useEffect(() => {
    const getFileData = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`/students/${id}`);
        setFile(get(data, 'Files[0].url', ''));
        setIsLoading(false);
      } catch {
        toast.error('Error to get a picture');
        setIsLoading(false);
        history.push('/');
      }
    };
    getFileData();
  }, [id]);

  const handleChange = async (e) => {
    const uploadedFile = e.target.files[0];
    const fileUrl = URL.createObjectURL(uploadedFile);

    setFile(fileUrl);

    const formData = new FormData();
    formData.append('student_id', id);
    formData.append('file', uploadedFile);

    try {
      setIsLoading(true);
      await axios.post('/files/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Picture was send');
      setIsLoading(false);
    } catch (err) {
      toast.success('Error to uploading the picture');
      setIsLoading(false);
      const status = get(err, 'response.status', '');
      if (status === 401) {
        dispatch(actions.loginFailure());
      }
    }
  };
  return (
    <Container>
      <Loading isLoading={isLoading} />
      <Title>Files</Title>
      <Form>
        <label htmlFor="file">
          {file ? <img src={file} alt="Profile Pic" /> : 'Choose a Photo'}
          <input type="file" id="file" onChange={handleChange} />
        </label>
      </Form>
    </Container>
  );
}

Files.propTypes = {
  match: PropTypes.shape({}).isRequired,
};
