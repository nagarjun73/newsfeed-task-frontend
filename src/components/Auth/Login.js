//packages
import { Box, Stack, Typography, TextField, Button, Card } from '@mui/material'
import { useState } from 'react'
import _ from 'lodash'
import axios from '../../config/axiosConfig'
import { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'

//helpers
import { UserContext } from '../../App'
import { CategoryContext } from '../../App';
import runValidaion from './Validations/Login-validation'
import cardCompCss from './styles/LoginStyles';
import getUserData from '../../helpers/getUserData';
import getCategoryData from '../../helpers/getCategoryData'
import clientErrorHandler from './helpers/errorHandleFunc';

const Login = (props) => {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [formError, setFormError] = useState({})
  const { userDispatch } = useContext(UserContext)
  const { categoryDispatch } = useContext(CategoryContext)
  const navigate = useNavigate()
  const fields = ['email', 'password']

  const loginHandleFunction = async (e) => {
    e.preventDefault()
    //Validation
    const formValidation = runValidaion(formData)
    try {
      if (_.isEmpty(formValidation)) {
        const result = await axios.post('users/login', formData)
        localStorage.setItem('token', result.data.token)
        //get user details
        getUserData(userDispatch)
        getCategoryData(categoryDispatch)
        //resetting
        setFormData({ email: "", password: "" })
        setFormError({})
        //navigating to news feed
        navigate('/')
      } else {
        setFormError(formValidation)
      }
    } catch (e) {
      clientErrorHandler(e)
    }
  }

  return (
    <Box paddingTop="20vh" >
      <Toaster />
      <Card component="form"
        sx={cardCompCss} onSubmit={loginHandleFunction}>
        <Stack justifyContent='center' width="50vw" spacing={3}>
          <Typography variant="h3">Login</Typography>
          {fields.map((filed, i) => {
            return <TextField
              label={filed}
              key={i}
              variant="outlined"
              type={filed === 'password' ? 'password' : 'text'}
              value={formData[filed]}
              onChange={(e) => setFormData({ ...formData, [filed]: e.target.value })}
              error={formError[filed] && true}
              helperText={formError[filed]}
              sx={{ backgroundColor: "white" }} />
          })}
          <Button type="submit" variant="contained">Login</Button>
        </Stack>
      </Card>
    </Box>
  )
}

export default Login