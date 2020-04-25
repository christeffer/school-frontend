import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { isEmail, isInt, isFloat } from 'validator';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { FaUserCircle, FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import axios from '../../services/axios';
import history from '../../services/history';
import { Container } from '../../styles/global';
import { Form, ProfilePicture, Title } from './styles';
import Loading from '../../components/Loading';
import * as actions from '../../store/modules/auth/actions';

export default function Student({ match }) {
  const dispatch = useDispatch();
  const id = get(match, 'params.id', 0);
  const [name, setName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [file, setFile] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function getStudentData() {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`/students/${id}`);
        const imgUrl = get(data, 'Files[0].url', '');
        setFile(imgUrl);
        setName(data.name);
        setLastName(data.lastname);
        setEmail(data.email);
        setAge(data.age);
        setHeight(data.height);
        setWeight(data.weight);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        const status = get(err, 'response.status', 0);
        const errors = get(err, 'response.data.errors', []);

        if (status === 400) {
          errors.map((error) => toast.error(error));
        }
        history.push('/');
      }
    }
    getStudentData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = false;

    if (name.length < 3 || name.length > 255) {
      formErrors = true;
      toast.error('Name should have between 3 and 255 characters');
    }

    if (!isEmail(email)) {
      formErrors = true;
      toast.error('Invalid Email');
    }

    if (!isInt(String(age))) {
      formErrors = true;
      toast.error('Age should be a number');
    }

    if (!isFloat(String(height))) {
      formErrors = true;
      toast.error('Height number format is invalid');
    }

    if (!isFloat(String(weight))) {
      formErrors = true;
      toast.error('Weight number format is invalid');
    }
    if (formErrors) return;

    try {
      if (id) {
        axios.put(`/students/${id}`, {
          name,
          lastname,
          email,
          age,
          height,
          weight,
        });
        toast.success('Student edited');
      } else {
        axios.post(`/students/`, {
          name,
          lastname,
          email,
          age,
          height,
          weight,
        });
        toast.success('Student created');
        history.push('/');
      }
    } catch (err) {
      const status = get(err, 'response.status', 0);
      const errors = get(err, 'response.data.errors', []);

      if (errors.lenght > 0) {
        errors.map((error) => toast.error(error));
      } else {
        toast.error('An undefined error has found');
      }

      if (status === 401) {
        dispatch(actions.loginFailure());
      }
    }
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <Title>{id ? 'Edit Student' : 'New Student'}</Title>

      <ProfilePicture>
        {id && file ? (
          <img src={file} alt={name} />
        ) : (
          <FaUserCircle size={180} />
        )}
        <Link to={`/files/${id}`}>
          <FaEdit size={24} />
        </Link>
      </ProfilePicture>

      <Form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <input
          type="text"
          value={lastname}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Age"
        />
        <input
          type="text"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          placeholder="Height"
        />
        <input
          type="text"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Weight"
        />
        <button type="submit">{id ? 'Save Student' : 'Create Student'}</button>
      </Form>
    </Container>
  );
}

Student.propTypes = {
  match: PropTypes.shape({}).isRequired,
};
