"use client"

export const playClickSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

    // Create oscillator
    const oscillator = audioContext.createOscillator()
    oscillator.type = "square" // Square wave for retro sound
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime) // 440 Hz = A4 note

    // Create gain node for volume control
    const gainNode = audioContext.createGain()
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime) // Start at 10% volume
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1) // Fade out

    // Connect nodes
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    // Play sound
    oscillator.start()
    oscillator.stop(audioContext.currentTime + 0.1) // Stop after 0.1 seconds
  } catch (error) {
    console.error("Error playing sound:", error)
  }
}
