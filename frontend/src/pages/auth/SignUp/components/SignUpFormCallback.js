import React,{ useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signupUser } from '../../API/profile';
import { useArtist } from '../../API/ArtistContext';

const SignUpPaymentCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useArtist();

  useEffect(() => {
    const handlePaymentCallback = async () => {
      const paymentResult = location.state;
      if (!paymentResult || paymentResult.status !== "success") {
        navigate('/auth/signup');
        return;
      }

      try {
        const savedFormData = JSON.parse(sessionStorage.getItem('signupFormData'));
        if (!savedFormData) {
          throw new Error('Form data not found');
        }

        const formDataToSend = new FormData();
        formDataToSend.append("name", savedFormData.name);
        formDataToSend.append("stage_name", savedFormData.stageName);
        formDataToSend.append("email", savedFormData.email);
        formDataToSend.append("phone", "+91" + savedFormData.contactNumber);
        formDataToSend.append("password", savedFormData.password);
        formDataToSend.append("payment_id", paymentResult.paymentData.newPaymentIds[0]);

        const response = await signupUser(formDataToSend);
        console.log(response);
        if (response.success) {
          login(response.data.token, response.data);
          toast.success("Signup Successful");
          sessionStorage.removeItem('signupFormData');
          navigate("/auth/create-profile/personal-details", { replace: true });
        }
      } catch (error) {
        console.error('Signup error:', error);
        toast.error(error.message || "Signup Failed. Please Try Again Later");
        navigate('/auth/signup');
      }
    };

    handlePaymentCallback();
  }, [location, navigate, login]);

  return null; // This component doesn't render anything
};

export default SignUpPaymentCallback;