import { useEffect, useState } from 'react';
import axiosInstance from './axiosInstance';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Form = () => {
  const navigate = useNavigate();
  const [empId, setEmpId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [position, setPosition] = useState('');
  const [joining, setJoining] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [countryOptions, setCountryOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedoc, setSelectedoc] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch data from "country.json" which contains country and state options
    fetch('/uploads/country.json')
      .then((response) => response.json())
      .then((data) => {
        setCountryOptions(data.countries);
      })
      .catch((error) => console.error('Error fetching country data:', error));
  }, []);

  const handleEmpIdChange = (e) => {
    setEmpId(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePositionChange = (e) => {
    setPosition(e.target.value);
  };

  const handleJoiningChange = (e) => {
    setJoining(e.target.value);
  };
  const handleMobileNoChange = (e) => {
    setMobileNo(e.target.value);
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };
  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setCountry(selectedCountry);

    // Find the selected country object from the countryOptions array
    const selectedCountryObj = countryOptions.find(
      (country) => country.country_code === selectedCountry
    );

    // Set the state options based on the selected country
    if (selectedCountryObj) {
      setStateOptions(selectedCountryObj.states);
      setState('');
    } else {
      setStateOptions([]);
      setState('');
    }
  };

  const handleStateChange = (e) => {
    setState(e.target.value);
  };


  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handlePincodeChange = (e) => {
    setPincode(e.target.value);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleDocumentChange = (e) => {
    setSelectedoc(e.target.files[0]);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mobileNo.length < 10) {
      setError('Mobile number must have a minimum of 10 digits.');
      return;
    }
    // Create a FormData object to store the form data
    const formData = new FormData();
    formData.append('emp_id', empId);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('position', position);
    formData.append('joining', joining);
    formData.append('mobileNo', mobileNo);
    formData.append('address', address);
    formData.append('country', country);
    formData.append('state', state);
    formData.append('city', city);
    formData.append('pincode', pincode);
    formData.append('jpg_file', selectedFile);
    formData.append('document', selectedoc);


    try {
      const response = await axiosInstance.post('/register', formData);
      toast.success(response.data.message);
      navigate('/Login');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error('Invalid file type. Only JPG files are allowed');
      }
      else if (error.response && error.response.status === 500) {
        toast.error('Failed to upload File.');
      }
      else if (error.response && error.response.status === 401) {
        toast.error('JPG file size exceeds the limit.');
      }
      else if (error.response && error.response.status === 402) {
        toast.error('Document file size exceeds the limit.');
      }
      else if (error.response && error.response.status === 403) {
        toast.error('Failed Registeration please try again.');
      }
      else {
        toast.error('Failed to upload and register.');
      }
    }
  };

  return (
    <div className="container">
      <h2>Employee Registration Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
            <label htmlFor="emp_id">
             Employee ID<span className="text-danger">*</span>
            </label>
              <input
                type="text"
                id="emp_id"
                name="emp_id"
                value={empId}
                onChange={handleEmpIdChange}
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="name">
              Name<span className="text-danger">*</span></label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={handleNameChange}
                className="form-control"
                required
              />
            </div>
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="email">
              Email<span className="text-danger">*</span></label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleEmailChange}
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="password">
              Password<span className="text-danger">*</span></label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
                className="form-control"
                required
              />
            </div>
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="position">
              Position<span className="text-danger">*</span></label>
              <select
                className="form-control"
                id="position"
                name="position"
                value={position}
                onChange={handlePositionChange}
                required
              >
                <option value="">Select Position</option>
                <option value="php developer">PHP Developer</option>
                <option value="react developer">React Developer</option>
                <option value="angular developer">Angular Developer</option>
                <option value="tester">Tester</option>
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="joining">
              Joining Date<span className="text-danger">*</span></label>
              <input
                type="date"
                className="form-control"
                id="joining"
                name="joining"
                value={joining}
                onChange={handleJoiningChange}
                required
              />
            </div>
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="mobileNo">
              Mobile No.<span className="text-danger">*</span></label>
              <input
                type="tel"
                id="mobileNo"
                name="mobileNo"
                value={mobileNo}
                onChange={handleMobileNoChange}
                className="form-control"
                required
              />
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                name="address"
                value={address}
                onChange={handleAddressChange}
                className="form-control"
                required
              ></textarea>
            </div>
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="country">
              Country<span className="text-danger">*</span></label>
              <select
                id="country"
                name="country"
                value={country}
                onChange={handleCountryChange}
                className="form-control"
                required
              >
                <option value="">Select Country</option>
                {countryOptions.map((option) => (
                  <option key={option.country_code} value={option.country_code}>
                    {option.country}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="state">
              State<span className="text-danger">*</span></label>
              <select
                id="state"
                name="state"
                value={state}
                onChange={handleStateChange}
                className="form-control"
                required
              >
                <option value="">Select State</option>
                {stateOptions.map((option) => (
                  <option key={option.country_code} value={option.country_code}>
                    {option.country}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="city">
              City<span className="text-danger">*</span></label>
              <input
                type="text"
                id="city"
                name="city"
                value={city}
                onChange={handleCityChange}
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="pincode">
              Pincode<span className="text-danger">*</span></label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                value={pincode}
                onChange={handlePincodeChange}
                className="form-control"
                required
              />
            </div>
          </div>
        </div>
        <br />
        <div className='row'>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="jpg_file">
              Image<span className="text-danger">*</span></label><br />
              <input
                type="file"
                id="jpg_file"
                name="jpg_file"
                onChange={handleFileChange}
                className="form-control-file"
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="document">
              Document<span className="text-danger">*</span></label><br />
              <input
                type="file"
                id="document"
                name="document"
                onChange={handleDocumentChange}
                className="form-control-file"
                required
              />
            </div>
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col">
            <button type="submit" className="btn btn-primary">Submit</button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default Form;
