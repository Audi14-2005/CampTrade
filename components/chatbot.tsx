"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { MessageCircle, X, Send, Bot, User, Phone, Users } from "lucide-react"

interface Message {
    id: string
    text: string
    isUser: boolean
    timestamp: Date
}

interface Executive {
    name: string
    phone: string
}

const EXECUTIVES: Executive[] = [
    { name: "Monic Auditya A", phone: "8825511797" },
    { name: "Akshaya", phone: "7667447308" },
    { name: "Harini", phone: "8122071086" },
    { name: "DhivyaShree", phone: "8807099153" },
]

const NAME_INDEX: Record<string, number> = {
    'monic': 0,
    'monic auditya': 0,
    'monic auditya a': 0,
    'akshaya': 1,
    'harini': 2,
    'dhivyashree': 3,
    'dhivya shree': 3,
    'dhivya': 3,
    'divyashree': 3,
}

export function Chatbot() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            text: "Hi! I'm Zyraa, your AI assistant for CampTrade. How can I help you today?",
            isUser: false,
            timestamp: new Date(),
        },
    ])
    const [inputValue, setInputValue] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isOpen])

    const sanitizeText = (text: string): string => {
        if (!text) return text
        // Remove markdown markers and normalize whitespace
        return text
            .replace(/[*_`]+/g, "")
            .replace(/^[\s]*[•\-*]+\s*/gm, "- ")
            .replace(/\r\n|\r/g, "\n")
            .replace(/\n{3,}/g, "\n\n")
            .replace(/[ \t]{2,}/g, " ")
            .trim()
    }

    const pickContactByName = (userMessage: string): Executive | null => {
        const lowerMessage = userMessage.toLowerCase()
        for (const [key, idx] of Object.entries(NAME_INDEX)) {
            if (lowerMessage.includes(key)) {
                return EXECUTIVES[idx]
            }
        }
        return null
    }

    const pickContactGeneric = (userMessage: string): Executive => {
        const idx = Math.abs(userMessage.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % EXECUTIVES.length
        return EXECUTIVES[idx]
    }

    const handleContactRequest = (userMessage: string): string | null => {
        const lowerMessage = userMessage.toLowerCase()

        // Check for specific name mentions
        const namedContact = pickContactByName(userMessage)
        if (namedContact) {
            return `You can contact ${namedContact.name} – ${namedContact.phone}.`
        }

        // Check for generic executive/contact/support requests
        const contactKeywords = ['executive', 'contact', 'support', 'talk to', 'call', 'phone', 'help', 'assistance']
        if (contactKeywords.some(keyword => lowerMessage.includes(keyword))) {
            const contact = pickContactGeneric(userMessage)
            return `You can contact ${contact.name} – ${contact.phone}.`
        }

        return null
    }

    const sendMessage = async () => {
        if (!inputValue.trim() || isLoading) return

        const userMessage = inputValue.trim()
        setInputValue("")

        // Add user message
        const newUserMessage: Message = {
            id: Date.now().toString(),
            text: userMessage,
            isUser: true,
            timestamp: new Date(),
        }

        setMessages(prev => [...prev, newUserMessage])
        setIsLoading(true)

        try {
            // Check for contact requests first
            const contactResponse = handleContactRequest(userMessage)
            if (contactResponse) {
                const botMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    text: contactResponse,
                    isUser: false,
                    timestamp: new Date(),
                }
                setMessages(prev => [...prev, botMessage])
                setIsLoading(false)
                return
            }

            // Call the API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage }),
            })

            if (!response.ok) {
                throw new Error('Failed to get response')
            }

            const data = await response.json()

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: data.reply,
                isUser: false,
                timestamp: new Date(),
            }

            setMessages(prev => [...prev, botMessage])
        } catch (error) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: "Sorry, I'm having trouble processing your request right now. Please try again later or contact one of our executives for assistance.",
                isUser: false,
                timestamp: new Date(),
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    return (
        <>
            {/* Chat Toggle Button */}
            <motion.div
                className="fixed bottom-6 right-6 z-50"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            >
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    className="h-16 w-16 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
                    size="icon"
                >
                    <AnimatePresence mode="wait">
                        {isOpen ? (
                            <motion.div
                                key="close"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <X className="h-7 w-7" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="chat"
                                initial={{ rotate: 90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: -90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <MessageCircle className="h-7 w-7" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Button>
            </motion.div>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed bottom-28 right-6 z-40 w-96 h-[500px] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-8rem)]"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2, type: "spring", stiffness: 300 }}
                    >
                        <Card className="h-full flex flex-col bg-background/95 backdrop-blur-sm border shadow-xl">
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b bg-primary/5">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Bot className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm">Zyraa</h3>
                                        <p className="text-xs text-muted-foreground">AI Assistant</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                    <span className="text-xs text-muted-foreground">Online</span>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.map((message) => (
                                    <motion.div
                                        key={message.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`max-w-[80%] rounded-lg px-3 py-2 ${message.isUser
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted"
                                                }`}
                                        >
                                            <div className="flex items-start gap-2">
                                                {!message.isUser && (
                                                    <Bot className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                                                )}
                                                <div className="flex-1">
                                                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                                                    <p className="text-xs opacity-70 mt-1">
                                                        {formatTime(message.timestamp)}
                                                    </p>
                                                </div>
                                                {message.isUser && (
                                                    <User className="h-4 w-4 mt-0.5 text-primary-foreground/70 flex-shrink-0" />
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}

                                {isLoading && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex justify-start"
                                    >
                                        <div className="bg-muted rounded-lg px-3 py-2">
                                            <div className="flex items-center gap-2">
                                                <Bot className="h-4 w-4 text-muted-foreground" />
                                                <div className="flex space-x-1">
                                                    <div className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
                                                    <div className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                                                    <div className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className="p-4 border-t">
                                <div className="flex gap-2">
                                    <Input
                                        ref={inputRef}
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Type your message..."
                                        disabled={isLoading}
                                        className="flex-1"
                                    />
                                    <Button
                                        onClick={sendMessage}
                                        disabled={!inputValue.trim() || isLoading}
                                        size="icon"
                                        className="h-10 w-10"
                                    >
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* Quick Actions */}
                                <div className="mt-2 flex gap-1">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs h-7"
                                        onClick={() => setInputValue("I need help with buying a product")}
                                    >
                                        <Users className="h-3 w-3 mr-1" />
                                        Help
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs h-7"
                                        onClick={() => setInputValue("Contact executive")}
                                    >
                                        <Phone className="h-3 w-3 mr-1" />
                                        Contact
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
