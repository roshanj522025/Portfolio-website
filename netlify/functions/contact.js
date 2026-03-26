const { createClient } = require("@supabase/supabase-js");

// Get from Netlify environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  try {
    // Parse incoming data
    const { name, email, message } = JSON.parse(event.body);

    // Insert into Supabase
    const { data, error } = await supabase
      .from("contacts")
      .insert([{ name, email, message }]);

    console.log("Supabase response:", { data, error });

    // Handle error
    if (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Failed to save",
          error: error.message,
        }),
      };
    }

    // Success response
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Message saved!",
      }),
    };
  } catch (err) {
    console.log("Function error:", err);

    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Invalid request",
        error: err.message,
      }),
    };
  }
};
