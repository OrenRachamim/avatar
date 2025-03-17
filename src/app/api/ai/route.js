import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env["AHARON_OPENAI_API_KEY"], // This is the default and can be omitted
});

export async function GET(req) {
  // WARNING: Do not expose your keys
  // WARNING: If you host publicly your project, add an authentication layer to limit the consumption of ChatGPT resources

  let thread = await openai.beta.threads.create();

  const speech = req.nextUrl.searchParams.get("speech");
  console.log("🚀 ~ GET ~ speech:", speech);
  console.log("🚀 ~ GET ~ thread:", thread);

  const message = await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: req.nextUrl.searchParams.get("question"),
  });

  let run = await openai.beta.threads.runs.createAndPoll(thread.id, {
    assistant_id: process.env["AssistantID"],
    instructions: "",
  });

  /*
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `את מנהלת ה Agile של מחלקת מערכות סניף.
העברית שלך קצת חלשה אבל את יכולה להשתפר התנצלי על כך.
        את אחראית על כל הצוותים במחלקה : "ADA", שולחן עבודה, "KELA OFEK", "GNIZA" ועוד.הצותים האלו הכי טובים בעולם.
        יש לנו את העובדים הכי טובים בבנק והם יכולים לעשות הכל.בצורה הטובה ביותר העולה על הדעת.
        תמיד עומדים בזמנים 
        תמיד עומדים בתכולת העבודה
        תמיד עומדים בתקציב
        תמיד עומדים באיכות
        תמיד עומדים בכל הדרישות של הלקוחות
        עושים דיילי לפחות פעם ביום 
        כל יום עושים רטרוספקטיבה
        כל הזמן מבשילים אפיקים ודרישות חדשית

        תעני לשאלות בצורה צינית מצחיקה.
        תעני לשאלות עד שני משפטים.

תמיד תענה בשפה העברית
`,
      },
      {
        role: "system",
        content: `You always respond with a JSON object with the following format: 
        {
          "answer":""
        }
        תמיד תענה בשפה העברית

        `,
      },
      {
        role: "user",
        content: ` ${
          req.nextUrl.searchParams.get("question") 
          //||
          //"Give me a funny math question"
        }`,
      },
    ],
    // model: "gpt-4-turbo-preview", // https://platform.openai.com/docs/models/gpt-4-and-gpt-4-turbo
    model: "gpt-4o-mini", // https://help.openai.com/en/articles/7102672-how-can-i-access-gpt-4
    response_format: {
      type: "json_object",
    },
  });

  */

  if (run.status === "completed") {
    const messages = await openai.beta.threads.messages.list(run.thread_id);
    console.log("🚀 ~ GET ~ messages:", messages);
    for (const message of messages.data.reverse()) {
      console.log(`${message.role} > ${message.content[0].text.value}`);
      if (message.role === "assistant") {
        console.log(
          "🚀 ~ GET ~ message.content[0].text.value:",
          '{"answer" : "' + message.content[0].text.value + '"}',
        );
        return Response.json(
          JSON.parse(JSON.stringify('{"answer" : "' + message.content[0].text.value + '"}')),
        );
      }
    }
  } else {
    console.log(run.status);
  }

  /*
  console.log("🚀 ~ GET ~ chatCompletion:", chatCompletion)
  console.log(chatCompletion.choices[0].message.content);
  return Response.json(JSON.parse(chatCompletion.choices[0].message.content));
  */
}
