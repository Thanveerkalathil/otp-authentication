import { useEffect, useRef} from "react";
import "./App.css";
import { Formik, useFormik } from "formik";
const validate = (values) => {
  const error = {};
  if (values.otp.some((data) => data === "")) {
    error.otp = "This field is required";
  }
  return error;
};

function App() {
  const formik = useFormik({
    initialValues: {
      otp: Array.from({ length: 6 }).fill(""),
    },
    validate,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const inputRef = useRef({});

  useEffect(() => {
    inputRef.current[0].focus();
    inputRef.current[0].addEventListener("paste", pasteText);
    return () => inputRef.current[0].removeEventListener("paste", pasteText);
  }, []);
  const pasteText = (event) => {
    const pastedText = event.clipboardData.getData("text");
    const fieldValue = {};
    Object.keys(otp).forEach((key, index) => {
      fieldValue[key] = pastedText[index];
    });
    setOtp(fieldValue);
    inputRef.current[5].focus();
  };
  const handleChange = (event, index) => {
    const { value } = event.target;
    if (/[a-z]/gi.test(value)) return;

    const currentOTP = [...formik.values.otp];
    currentOTP[index] = value.slice(-1);
    formik.setValues((prev) => ({
      ...prev,
      otp: currentOTP,
    }));

    if (value && index < 5) {
      inputRef.current[index + 1].focus();
    }
  };
  const handleBackspace = (event, index) => {
    if (event.key === "Backspace")
      if (index > 0) {
        inputRef.current[index - 1].focus();
      }
  };
  const renderInput = () => {
    return formik.values.otp.map((value, index) => (
      <input
        key={index}
        ref={(element) => (inputRef.current[index] = element)}
        type="text"
        value={value}
        name={index}
        className="w-16 h-16 rounded-md mr-3 text-center text-xl"
        onChange={(event) => handleChange(event, index)}
        onKeyUp={(event) => handleBackspace(event, index)}
      />
    ));
  };

  return (
    <form action="">
      <h3 className="text-3xl mb-8 ">Please fill the OTP</h3>
      <Formik>
        <div>{renderInput()}</div>
      </Formik>
      {formik.errors.otp && <p>Please fill the fields</p>}
      <button
        className="mt-4 w-38 border-solid bg-[#3b3b3b] rounded-md hover:bg-[#252525] hover:border-[white]"
        onClick={formik.handleSubmit}
        type="button"
      >
        Submit
      </button>
    </form>
  );
}

export default App;
