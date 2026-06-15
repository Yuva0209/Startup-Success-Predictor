import React, { useEffect, useState } from "react";


interface TextTypeProps {
    words?: string[];
    typingSpeed?: number;
    deletingSpeed?: number;
    pauseTime?: number;
}

const TextType: React.FC<TextTypeProps> = ({
    words = ["Predict", "Analyze", "Evaluate", "Scale"],
    typingSpeed = 120,
    deletingSpeed = 60,
    pauseTime = 1200,
}) => {
    const [text, setText] = useState("");
    const [index, setIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentWord = words[index % words.length];

        let timer: ReturnType<typeof setTimeout>;

        if (!isDeleting) {
            timer = setTimeout(() => {
                setText(currentWord.substring(0, text.length + 1));

                if (text === currentWord) {
                    setTimeout(() => setIsDeleting(true), pauseTime);
                }
            }, typingSpeed);
        } else {
            timer = setTimeout(() => {
                setText(currentWord.substring(0, text.length - 1));

                if (text === "") {
                    setIsDeleting(false);
                    setIndex((prev) => prev + 1);
                }
            }, deletingSpeed);
        }

        return () => clearTimeout(timer);
    }, [text, isDeleting, index, words, typingSpeed, deletingSpeed, pauseTime]);

    return (
        <span className="text-transparent bg-gradient-to-r from-brandPurple via-brandIndigo to-brandCyan bg-clip-text font-bold">
            {text}
            <span className="animate-pulse">|</span>
        </span>
    );
};

export default TextType;