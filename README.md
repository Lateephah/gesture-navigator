# 🖐️ Gesture Navigator

**Touchless, vision-controlled navigation powered by deep learning.**

### 🚀 [**Live Demo →**](https://9d3390d0.mydala.app/)

---

## The Problem

Imagine trying to scroll through a recipe while your hands are covered in flour from baking, or soaked in soap while washing dishes. Or checking a repair tutorial when your hands are covered in grease from fixing a car. Touching your phone means stopping what you're doing, cleaning your hands, or dirtying the device.

Voice assistants offer a hands-free alternative, but they're not always practical. In noisy environments, voice commands can be misunderstood, and in quiet places libraries, classrooms, meetings, or late at night speaking aloud may be inconvenient or disruptive.

These everyday situations highlight the need for an intuitive, touchless, and silent way of interacting with digital devices.

## The Solution

**Gesture Navigator** explores computer vision and deep learning to recognize hand gestures as control commands. By classifying six predefined gestures from a live camera feed, it lays the foundation for a gesture-controlled navigation interface — enabling users to interact with applications naturally, without touching the screen or relying on voice commands.

Rather than a standalone app, Gesture Navigator is designed as a **proof-of-concept feature**,  something a cooking app, DIY/repair platform, or craft-tutorial service could integrate to let users navigate hands-free at exactly the moment their hands are busiest.

## Gesture Guide

| Gesture | Action |
|---|---|
| ✌️ **Peace** | Toggle navigation on/off (hold 1.5s) |
| 👆 **Up** | Scroll up |
| 👇 **Down** | Scroll down |
| 👈 **Left** | Previous page |
| 👉 **Right** | Next page |
| ✋ **Palm** | Click / activate selected item |

## How It Works

1. **Model training**: An `EfficientNetB0`-based classifier was trained on a custom dataset of six hand gestures using transfer learning (frozen ImageNet backbone + a custom classification head).
2. **In-browser inference**: The trained Keras model was converted to a TensorFlow.js **graph model** and deployed to run entirely client-side — no backend server, no round-trip latency, real-time predictions straight from the webcam feed.
3. **Gesture-to-action mapping**: Predictions are smoothed across consecutive frames for stability, then mapped to navigation actions (scroll, page-switch, click) in the frontend.

## Tech Stack

- **Model:** TensorFlow / Keras, EfficientNetB0 (transfer learning)
- **Deployment:** TensorFlow.js (in-browser graph model inference)
- **Frontend:** React, TypeScript, Tailwind CSS
- **Training environment:** Google Colab

## Project Status & Limitations

This is an early-stage prototype, and transparency about its current limits matters as much as the demo itself:

- Performance is sensitive to **lighting conditions and background**,  the model performs best in consistent, plain-background environments similar to its training data.
- A couple of gestures (notably **palm**) are currently less reliable than others — primarily a training-data limitation rather than an architectural one.
- The model was trained on a relatively small, self-collected dataset; broader gesture and user diversity would meaningfully improve robustness.

## Roadmap

- [ ] Expand the training dataset with more lighting conditions, backgrounds, and users
- [ ] Integrate hand-landmark detection (e.g. MediaPipe) to isolate the hand before classification, reducing background sensitivity
- [ ] Fine-tune the upper EfficientNet layers for improved accuracy
- [ ] Optimize for lightweight mobile inference
- [ ] Extend toward accessibility use cases for users with mobility impairments

## Model Performance

| Model | Test Accuracy |
|---|---|
| Baseline CNN | 68.2% |
| Baseline CNN (40 epochs) | 85.3% |
| Improved CNN | 87.8% |
| **EfficientNetB0 (final)** | **96.7%** |

## Acknowledgements

Built as part of the **3MTT Knowledge Showcase **.

Special thanks to **[Dala Studio](https://dala.app)** for providing the platform and sponsoring this showcase, the frontend deployment and hosting for this project would not have been possible without their support and credits.

---

### 🔗 [**Try the live demo**](https://9d3390d0.mydala.app/)
