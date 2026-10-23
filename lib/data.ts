import type { TopicMeta, Video, VideoCardData } from "./types";

/**
 * Seed "video library". Each entry streams a real YouTube video (verified,
 * embeddable) via its `youtubeId`. The `transcript` is a curated summary used
 * by the real-LLM path; `facts` power the free "mock" game generator so the
 * whole app runs with zero API keys.
 *
 * Sources: 3Blue1Brown, Crash Course, Domain of Science.
 * To use your own clips, add a `videoUrl` (.mp4) instead, or omit both for a
 * text card.
 */
const videos: Video[] = [
  // ---------------------------------------------------------------- LINEAR ALGEBRA
  {
    id: "la-vectors",
    topic: "Linear Algebra",
    title: "Vectors, what even are they?",
    creator: "3Blue1Brown",
    durationSec: 8,
    emoji: "➡️",
    gradient: "linear-gradient(135deg, #7f00ff, #e100ff)",
    youtubeId: "fNk_zzaMoSs",
    tags: ["vectors", "basics"],
    transcript:
      "A vector is an arrow with a length and a direction. In a coordinate system, we write it as a list of numbers, like [3, 2], meaning 3 steps right and 2 steps up. Adding vectors means stacking them tip to tail.",
    facts: [
      {
        q: "What two properties define a vector?",
        correct: "Length (magnitude) and direction",
        wrong: ["Speed and mass", "Color and size", "Only its length"],
      },
      {
        q: "In the vector [3, 2], what does the 3 mean?",
        correct: "3 units along the first axis",
        wrong: ["3 units up", "It is a 3D vector", "A length of 3"],
      },
      {
        q: "How do you add two vectors?",
        correct: "Tip to tail",
        wrong: ["Multiply their lengths", "Rotate them 90°", "Take the average position"],
      },
    ],
  },
  {
    id: "la-span",
    topic: "Linear Algebra",
    title: "Linear combinations, span, and basis vectors",
    creator: "3Blue1Brown",
    durationSec: 8,
    emoji: "🧭",
    gradient: "linear-gradient(135deg, #0f2027, #203a43)",
    youtubeId: "k7RM-ot2NWY",
    tags: ["span", "combinations"],
    transcript:
      "A linear combination scales vectors and adds them together. The span of a set of vectors is every point you can reach with those combinations. Two vectors that are not parallel span the entire 2D plane.",
    facts: [
      {
        q: "The span of two non-parallel vectors in 2D is…",
        correct: "The entire plane",
        wrong: ["A single line", "A single point", "Only the origin"],
      },
      {
        q: "What is a linear combination?",
        correct: "Scaled vectors added together",
        wrong: ["Two vectors multiplied", "A reflected vector", "A rotated vector"],
      },
      {
        q: "When do vectors span only a line?",
        correct: "When they are all parallel",
        wrong: ["When they are perpendicular", "When there are three of them", "When they have length 1"],
      },
    ],
  },
  {
    id: "la-matrices",
    topic: "Linear Algebra",
    title: "Linear transformations and matrices",
    creator: "3Blue1Brown",
    durationSec: 9,
    emoji: "🧩",
    gradient: "linear-gradient(135deg, #41295a, #2f0743)",
    youtubeId: "kYB8IZa5AuE",
    tags: ["matrices", "transformations"],
    transcript:
      "A matrix is a rule that transforms space. Multiplying a matrix by a vector moves that vector to a new location. The columns of the matrix tell you where the basis vectors land.",
    facts: [
      {
        q: "What does a matrix represent?",
        correct: "A linear transformation of space",
        wrong: ["A list of random numbers", "A measurement", "A constant"],
      },
      {
        q: "The columns of a matrix tell you…",
        correct: "Where the basis vectors land",
        wrong: ["The matrix's determinant", "Nothing useful", "The matrix's size"],
      },
      {
        q: "Multiplying a matrix by a vector…",
        correct: "Transforms the vector to a new position",
        wrong: ["Always lengthens the vector", "Deletes the vector", "Rotates space by 180°"],
      },
    ],
  },
  {
    id: "la-eigen",
    topic: "Linear Algebra",
    title: "Eigenvectors and eigenvalues",
    creator: "3Blue1Brown",
    durationSec: 9,
    emoji: "🎯",
    gradient: "linear-gradient(135deg, #134e5e, #71b280)",
    youtubeId: "PFDu9oVAE-g",
    tags: ["eigenvalues", "eigenvectors"],
    transcript:
      "An eigenvector is a vector that only gets scaled by a transformation, not rotated. The scale factor is its eigenvalue. They matter because they reveal the hidden axes of a transformation.",
    facts: [
      {
        q: "An eigenvector is a vector that a transformation…",
        correct: "Only scales (stretches or squishes)",
        wrong: ["Always rotates", "Always deletes", "Reflects across the origin"],
      },
      {
        q: "What is the eigenvalue?",
        correct: "The factor by which the eigenvector is scaled",
        wrong: ["The length of the matrix", "The number of columns", "The angle of rotation"],
      },
      {
        q: "Why do eigenvectors matter?",
        correct: "They reveal the key axes of a transformation",
        wrong: ["They are always unit vectors", "They only exist in 3D", "They are random"],
      },
    ],
  },
  {
    id: "la-det",
    topic: "Linear Algebra",
    title: "The determinant",
    creator: "3Blue1Brown",
    durationSec: 8,
    emoji: "📐",
    gradient: "linear-gradient(135deg, #232526, #414345)",
    youtubeId: "Ip3X9LOh2dk",
    tags: ["determinants", "area"],
    transcript:
      "The determinant measures how much a transformation scales area. A determinant of zero means the transformation squishes space into a lower dimension. A negative determinant flips orientation.",
    facts: [
      {
        q: "The determinant measures…",
        correct: "How much a transformation scales area/volume",
        wrong: ["The angle between vectors", "The sum of the entries", "The number of rows"],
      },
      {
        q: "A determinant of zero means…",
        correct: "Space is squished to a lower dimension",
        wrong: ["The matrix is the identity", "Nothing changed", "The vectors are unit length"],
      },
      {
        q: "A negative determinant means…",
        correct: "Orientation is flipped",
        wrong: ["The matrix is invalid", "Area becomes negative", "The transformation is mirrored only"],
      },
    ],
  },

  // ---------------------------------------------------------------- MACHINE LEARNING
  {
    id: "ml-nn-basics",
    topic: "Machine Learning",
    title: "But what is a neural network?",
    creator: "3Blue1Brown",
    durationSec: 8,
    emoji: "🤖",
    gradient: "linear-gradient(135deg, #f953c6, #b91d73)",
    youtubeId: "aircAruvnKk",
    tags: ["neural networks", "basics"],
    transcript:
      "A neural network is built from layers of neurons. Each neuron takes a weighted sum of its inputs and applies an activation function. With enough layers, a network can learn to recognize handwritten digits.",
    facts: [
      {
        q: "What are the basic building blocks of a neural network?",
        correct: "Neurons arranged in layers",
        wrong: ["Loops and variables", "HTML elements", "Database tables"],
      },
      {
        q: "What does each neuron compute?",
        correct: "A weighted sum of inputs, then an activation",
        wrong: ["The average of its inputs", "A random number", "Only a yes/no flag"],
      },
    ],
  },
  {
    id: "ml-gradient",
    topic: "Machine Learning",
    title: "Gradient descent, how neural networks learn",
    creator: "3Blue1Brown",
    durationSec: 8,
    emoji: "📉",
    gradient: "linear-gradient(135deg, #00c6ff, #0072ff)",
    youtubeId: "IHZwWFHWa-w",
    tags: ["optimization", "cost function"],
    transcript:
      "Training a network means finding weights that make its outputs match the data. The cost function measures how wrong the outputs are. Gradient descent nudges the weights downhill to reduce that cost.",
    facts: [
      {
        q: "What does the cost function measure?",
        correct: "How wrong the network's outputs are",
        wrong: ["The network's speed", "The number of layers", "The color of the data"],
      },
      {
        q: "Gradient descent changes the weights to…",
        correct: "Reduce the cost",
        wrong: ["Increase the cost", "Add more layers", "Shuffle the data"],
      },
    ],
  },
  {
    id: "ml-backprop",
    topic: "Machine Learning",
    title: "What is backpropagation really doing?",
    creator: "3Blue1Brown",
    durationSec: 8,
    emoji: "🕸️",
    gradient: "linear-gradient(135deg, #654ea3, #eaafc8)",
    youtubeId: "Ilg3gGewQ5U",
    tags: ["backpropagation", "training"],
    transcript:
      "Backpropagation figures out how much each weight contributed to the error. It then adjusts every weight a little, from the output layer back toward the input, so the network gets less wrong next time.",
    facts: [
      {
        q: "Backpropagation determines…",
        correct: "How much each weight contributed to the error",
        wrong: ["Which layer to delete", "The best learning rate to ignore", "Nothing useful"],
      },
      {
        q: "After computing the error, backpropagation…",
        correct: "Adjusts weights to reduce the error",
        wrong: ["Removes neurons", "Reorders the inputs", "Randomizes the weights"],
      },
    ],
  },
  {
    id: "ml-backprop-calc",
    topic: "Machine Learning",
    title: "Backpropagation calculus",
    creator: "3Blue1Brown",
    durationSec: 8,
    emoji: "🎭",
    gradient: "linear-gradient(135deg, #c31432, #240b36)",
    youtubeId: "tIeHLnjs5U8",
    tags: ["calculus", "chain rule"],
    transcript:
      "Backpropagation is the calculus of learning. The chain rule tells us how a tiny change in one weight ripples through the network and changes the final cost, so we know which direction to adjust each weight.",
    facts: [
      {
        q: "The chain rule in backpropagation…",
        correct: "Propagates how small changes ripple through the network",
        wrong: ["Adds constants", "Deletes layers", "Counts the neurons"],
      },
      {
        q: "What does the derivative tell us during training?",
        correct: "Which direction to adjust each weight",
        wrong: ["The network's age", "The size of the dataset", "A random direction"],
      },
    ],
  },

  // ---------------------------------------------------------------- QUANTUM PHYSICS
  {
    id: "qp-super",
    topic: "Quantum Physics",
    title: "Some light quantum mechanics",
    creator: "3Blue1Brown × MinutePhysics",
    durationSec: 8,
    emoji: "🌌",
    gradient: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
    youtubeId: "MzRCDLre1b4",
    tags: ["superposition", "measurement"],
    transcript:
      "Quantum systems can be in superpositions — combinations of multiple states at once. A qubit, for example, can be partly '0' and partly '1'. Measurement collapses the superposition into a single definite outcome.",
    facts: [
      {
        q: "Superposition means a system can be…",
        correct: "In multiple states at once",
        wrong: ["Only in one state", "Always zero", "Predictably fixed"],
      },
      {
        q: "Measurement causes the state to…",
        correct: "Collapse to one outcome",
        wrong: ["Expand forever", "Become faster", "Split into two systems"],
      },
    ],
  },
  {
    id: "qp-entangle",
    topic: "Quantum Physics",
    title: "The Map of Quantum Physics",
    creator: "Domain of Science",
    durationSec: 8,
    emoji: "🔗",
    gradient: "linear-gradient(135deg, #141e30, #243b55)",
    youtubeId: "gAFAj3pzvAA",
    tags: ["entanglement", "overview"],
    transcript:
      "Quantum physics describes how particles behave at the smallest scales. Entanglement links particles so that measuring one instantly determines the state of another, no matter how far apart they are.",
    facts: [
      {
        q: "Entangled particles…",
        correct: "Share one quantum state",
        wrong: ["Are always adjacent", "Have no relation", "Travel faster than light"],
      },
      {
        q: "Measuring one entangled particle…",
        correct: "Instantly determines the other",
        wrong: ["Destroys the other", "Does nothing", "Reverses time"],
      },
    ],
  },
  {
    id: "qp-wave",
    topic: "Quantum Physics",
    title: "Quantum Mechanics — Part 2",
    creator: "CrashCourse",
    durationSec: 8,
    emoji: "〰️",
    gradient: "linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b)",
    youtubeId: "qO_W70VegbQ",
    tags: ["wavefunction", "probability"],
    transcript:
      "The wavefunction encodes the probabilities of where a particle can be found. Its squared magnitude gives the probability of measuring each outcome. It evolves over time according to the Schrödinger equation.",
    facts: [
      {
        q: "The wavefunction encodes…",
        correct: "Probabilities of outcomes",
        wrong: ["Exact positions only", "Temperature", "Classical forces"],
      },
      {
        q: "The squared magnitude of the wavefunction gives…",
        correct: "Probability of finding the particle",
        wrong: ["The particle's mass", "The particle's speed", "Nothing"],
      },
    ],
  },
  {
    id: "qp-uncertainty",
    topic: "Quantum Physics",
    title: "The uncertainty principle, visually",
    creator: "3Blue1Brown",
    durationSec: 8,
    emoji: "👁️",
    gradient: "linear-gradient(135deg, #16222a, #3a6073)",
    youtubeId: "MBnnXbOM5S4",
    tags: ["uncertainty", "fourier"],
    transcript:
      "The uncertainty principle says you can't know certain pairs of properties — like position and momentum — perfectly at once. It's a consequence of wave-like behavior and the Fourier transform.",
    facts: [
      {
        q: "The uncertainty principle says you can't perfectly know…",
        correct: "Certain pairs like position and momentum together",
        wrong: ["Any single property", "The speed of light", "The particle's mass"],
      },
      {
        q: "The uncertainty principle is connected to…",
        correct: "Wave behavior and the Fourier transform",
        wrong: ["Gravity", "Temperature", "Chemical bonds"],
      },
    ],
  },

  // ---------------------------------------------------------------- CALCULUS
  {
    id: "calc-essence",
    topic: "Calculus",
    title: "The essence of calculus",
    creator: "3Blue1Brown",
    durationSec: 8,
    emoji: "🧮",
    gradient: "linear-gradient(135deg, #00b09b, #96c93d)",
    youtubeId: "WUvTyaaNkzM",
    tags: ["calculus", "intro"],
    transcript:
      "Calculus is the study of change. Its two big ideas are derivatives, which measure instantaneous rates of change, and integrals, which accumulate tiny pieces into a whole. The key is breaking a problem into infinitely small pieces.",
    facts: [
      {
        q: "Calculus studies change by…",
        correct: "Breaking it into infinitely small pieces",
        wrong: ["Adding big steps", "Ignoring change", "Measuring only distance"],
      },
      {
        q: "The two big ideas of calculus are…",
        correct: "Derivatives (rates) and integrals (accumulation)",
        wrong: ["Addition and subtraction", "Geometry and algebra", "Forces and mass"],
      },
    ],
  },
  {
    id: "calc-derivative",
    topic: "Calculus",
    title: "The paradox of the derivative",
    creator: "3Blue1Brown",
    durationSec: 8,
    emoji: "📈",
    gradient: "linear-gradient(135deg, #11998e, #38ef7d)",
    youtubeId: "9vKqVkMQHKk",
    tags: ["derivatives", "rates"],
    transcript:
      "A derivative is an instantaneous rate of change. The paradox is how to define change at a single instant in time, when change normally happens across an interval. We look at what happens as that interval shrinks toward zero.",
    facts: [
      {
        q: "A derivative is…",
        correct: "An instantaneous rate of change",
        wrong: ["Total distance traveled", "A fixed constant", "The area under a curve"],
      },
      {
        q: "The 'paradox' of the derivative is…",
        correct: "How to measure change at a single instant",
        wrong: ["Why numbers are infinite", "How to add infinitely", "Why circles exist"],
      },
    ],
  },
  {
    id: "calc-formulas",
    topic: "Calculus",
    title: "Derivative formulas through geometry",
    creator: "3Blue1Brown",
    durationSec: 8,
    emoji: "📐",
    gradient: "linear-gradient(135deg, #134e5e, #71b280)",
    youtubeId: "S0_qX4VJhMQ",
    tags: ["derivatives", "power rule"],
    transcript:
      "Common derivative formulas can be understood geometrically, not just memorized. For example, the power rule says the derivative of x to the n is n times x to the n minus one.",
    facts: [
      {
        q: "The power rule says d/dx(x^n) = …",
        correct: "n·x^(n−1)",
        wrong: ["x^(n+1)", "n·x", "x^n"],
      },
      {
        q: "Geometrically, derivative formulas come from…",
        correct: "Thinking about tiny changes to area and volume",
        wrong: ["Memorizing tables", "Random guessing", "Only algebra"],
      },
    ],
  },
  {
    id: "calc-chain",
    topic: "Calculus",
    title: "Visualizing the chain rule and product rule",
    creator: "3Blue1Brown",
    durationSec: 8,
    emoji: "⛓️",
    gradient: "linear-gradient(135deg, #654ea3, #eaafc8)",
    youtubeId: "YG15m2VwSjA",
    tags: ["chain rule", "product rule"],
    transcript:
      "The chain rule handles derivatives of composed functions, where one function is inside another. The product rule handles derivatives of two functions multiplied together.",
    facts: [
      {
        q: "The chain rule handles…",
        correct: "Derivatives of composed functions",
        wrong: ["Sums of functions", "Constants only", "Integration"],
      },
      {
        q: "The product rule applies when…",
        correct: "Multiplying two functions",
        wrong: ["Adding two functions", "Dividing by a constant", "Finding a limit"],
      },
    ],
  },
  {
    id: "calc-ftc",
    topic: "Calculus",
    title: "Integration and the fundamental theorem of calculus",
    creator: "3Blue1Brown",
    durationSec: 8,
    emoji: "∞",
    gradient: "linear-gradient(135deg, #232526, #414345)",
    youtubeId: "rfG8ce4nNh0",
    tags: ["integration", "fundamental theorem"],
    transcript:
      "Integration is the inverse of differentiation. The fundamental theorem of calculus connects derivatives and integrals, showing that finding areas and finding rates of change are two sides of the same coin.",
    facts: [
      {
        q: "Integration is…",
        correct: "The inverse of differentiation",
        wrong: ["The same as differentiation", "Unrelated to derivatives", "Only for areas"],
      },
      {
        q: "The fundamental theorem of calculus connects…",
        correct: "Derivatives and integrals",
        wrong: ["Algebra and geometry", "Speed and mass", "Sine and cosine"],
      },
    ],
  },

  // ---------------------------------------------------------------- COMPUTER SCIENCE
  {
    id: "cs-early",
    topic: "Computer Science",
    title: "Early Computing",
    creator: "CrashCourse",
    durationSec: 8,
    emoji: "🖥️",
    gradient: "linear-gradient(135deg, #141e30, #243b55)",
    youtubeId: "O5nskjZ_GoI",
    tags: ["history", "computing"],
    transcript:
      "Computing began long before electronics, with devices like the abacus and mechanical calculators. Each step mechanized arithmetic and paved the way for the modern computer.",
    facts: [
      {
        q: "The earliest computing devices include…",
        correct: "The abacus and mechanical calculators",
        wrong: ["Smartphones", "The internet", "Quantum computers"],
      },
      {
        q: "Early computing advanced by…",
        correct: "Mechanizing arithmetic",
        wrong: ["Wireless signals", "Machine learning", "Touch screens"],
      },
    ],
  },
  {
    id: "cs-electronic",
    topic: "Computer Science",
    title: "Electronic Computing",
    creator: "CrashCourse",
    durationSec: 8,
    emoji: "💡",
    gradient: "linear-gradient(135deg, #0f2027, #203a43)",
    youtubeId: "LN0ucKNX0hc",
    tags: ["electronics", "transistors"],
    transcript:
      "Early electronic computers used vacuum tubes, which were large and unreliable. Transistors replaced them, making computers smaller, faster, and far more reliable.",
    facts: [
      {
        q: "Early electronic computers used…",
        correct: "Vacuum tubes, later replaced by transistors",
        wrong: ["Lasers", "Magnets only", "Pneumatics"],
      },
      {
        q: "Transistors improved computers by being…",
        correct: "Smaller, faster, and more reliable",
        wrong: ["Bigger and hotter", "Slower", "Mechanical"],
      },
    ],
  },
  {
    id: "cs-logic",
    topic: "Computer Science",
    title: "Boolean Logic & Logic Gates",
    creator: "CrashCourse",
    durationSec: 8,
    emoji: "🚪",
    gradient: "linear-gradient(135deg, #41295a, #2f0743)",
    youtubeId: "gI-qXk7XojA",
    tags: ["boolean logic", "logic gates"],
    transcript:
      "Computers do math with boolean logic built from just three operations: AND, OR, and NOT. Logic gates are physical circuits that perform these boolean operations.",
    facts: [
      {
        q: "A logic gate is…",
        correct: "A circuit that performs a boolean operation",
        wrong: ["A type of memory", "A display screen", "A power supply"],
      },
      {
        q: "The basic boolean operations are…",
        correct: "AND, OR, NOT",
        wrong: ["ADD, SUB, MUL", "READ, WRITE, COPY", "IF, ELSE, FOR"],
      },
    ],
  },
  {
    id: "cs-binary",
    topic: "Computer Science",
    title: "Representing Numbers and Letters with Binary",
    creator: "CrashCourse",
    durationSec: 8,
    emoji: "0️⃣",
    gradient: "linear-gradient(135deg, #16222a, #3a6073)",
    youtubeId: "1GSjbWt0c9M",
    tags: ["binary", "data"],
    transcript:
      "Computers represent all data with binary — just ones and zeros. Numbers, letters, and images are all encoded as sequences of bits.",
    facts: [
      {
        q: "Computers represent data using…",
        correct: "Binary (1s and 0s)",
        wrong: ["Decimal only", "Letters only", "Analog voltages"],
      },
      {
        q: "In binary, the number 2 is written as…",
        correct: "10",
        wrong: ["2", "11", "100"],
      },
    ],
  },
];

export function getAllVideos(): Video[] {
  return videos;
}

export function getVideosByTopic(topic: string): Video[] {
  const q = topic.trim().toLowerCase();
  if (!q || q === "all") return videos;
  return videos.filter(
    (v) =>
      v.topic.toLowerCase().includes(q) ||
      v.title.toLowerCase().includes(q) ||
      v.tags.some((t) => t.includes(q)),
  );
}

export function getVideosByIds(ids: string[]): Video[] {
  const byId = new Map(videos.map((v) => [v.id, v]));
  return ids.map((id) => byId.get(id)).filter((v): v is Video => Boolean(v));
}

/** Strip curated answer facts so the client only gets what it needs to render. */
export function toCards(videos: Video[]): VideoCardData[] {
  return videos.map((v) => ({
    id: v.id,
    topic: v.topic,
    title: v.title,
    creator: v.creator,
    durationSec: v.durationSec,
    youtubeId: v.youtubeId,
    videoUrl: v.videoUrl,
    transcript: v.transcript,
    tags: v.tags,
    gradient: v.gradient,
    emoji: v.emoji,
  }));
}

export function listTopics(): TopicMeta[] {
  const seen = new Map<string, TopicMeta>();
  for (const v of videos) {
    if (!seen.has(v.topic)) {
      seen.set(v.topic, {
        slug: v.topic.toLowerCase().replace(/\s+/g, "-"),
        label: v.topic,
        emoji: v.emoji,
        description: `${v.topic} explained in short, swipeable lessons`,
      });
    }
  }
  return [...seen.values()];
}
