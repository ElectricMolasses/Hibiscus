import React, { useState, useEffect, ReactElement } from 'react';
import { render, Text, Box, useStdin, useFocus, useFocusManager } from 'ink';

const focusedStyle = {
    "color": "magenta",
    "backgroundColor": "grey",
}

interface StepComponentProps {
    goNextStep: Function
}

interface StepFC extends React.FC<StepComponentProps> {}

const Welcome: StepFC = ({ goNextStep }) => {
    const [progressTimer, setProgressTimer] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgressTimer(previousTimer => previousTimer + 1);
        }, 1000);

        return () => {
            clearInterval(timer);
        }
    }, []);

    useEffect(() => {
        if (progressTimer > 5) {
            goNextStep();
        }
    }, [progressTimer]);

    return <Text color="white">🌸 Welcome to Hibiscus! 🌸</Text>;
}

interface ColumnDisplayProps {
    children: ReactElement[]
}

const ColumnDisplay = ({ children }: ColumnDisplayProps) => {
    return (
        <Box flexDirection="row" justifyContent="space-between" width="100%">
            <Box flexDirection="column">
                { ...children.slice(0, Math.ceil(children.length/2)) }
            </Box>
            <Box flexDirection="column">
                { ...children.slice(Math.ceil(children.length/2)) }
            </Box>
        </Box>
    )
}

interface CheckItemProps {
    text: string
    isChecked: boolean
}

const CheckItem = ({ text, isChecked }: CheckItemProps) => {
    const { isFocused } = useFocus();

    const style = isFocused ? focusedStyle : {}

    return <Text {...style}>[{isChecked ? "x" : " "}] {text}</Text>
}

interface ConfirmButtonProps {
    isHighlighted: boolean
}

const ConfirmButton = ({ isHighlighted }: ConfirmButtonProps) => {
    const { isFocused } = useFocus();

    const style = isFocused ? focusedStyle : {}

    return <Text {...style}>Confirm</Text>
}

const ProjectSetup: StepFC= () => {
    const { enableFocus } = useFocusManager();

    useEffect(() => {
        enableFocus();
    }, []);

    return  <Box flexDirection="column" alignItems="center" width={60}>
                <Box flexDirection="row">
                    <Text color="white">🌸 Language Selection 🌸</Text>
                </Box>
                <Box height={1} />
                <ColumnDisplay>
                    <CheckItem text="C#" isChecked={false} />
                    <CheckItem text="Go" isChecked={false} />
                    <CheckItem text="Javascript" isChecked={false} />
                    <CheckItem text="Python" isChecked={false} />
                    <CheckItem text="Rust" isChecked={false} />
                </ColumnDisplay>
                <ConfirmButton isHighlighted={true} />
            </Box>
}

const Complete: React.FC<StepComponentProps> = () => {
    return <Text color="white">All Done!</Text>;
}

const Main = () => {
    const [currentStep, setCurrentStep] = useState(0);

    const goNextStep: Function = () => {
        setCurrentStep(previousStep => previousStep + 1);
    }

    let ComponentList: StepFC[] = [Welcome, ProjectSetup, Complete];

    return (
        <Box flexGrow={1} alignSelf="center" height={16}>
            {React.createElement(ComponentList[currentStep], { goNextStep })}
        </Box>
    )
}

render(<Main />);
