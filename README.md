# Bonus: Gemma 4 Lokálna Inferencia

## Prehľad
Táto aplikácia bola vygenerovaná pomocou lokálne bežiaceho modelu **Gemma 4 12B** 
cez `llama-server` (llama.cpp), napojenom na `opencode` ako AI agent.

## Nastavenie
- Model: `gemma-4-12b-it Q4_K_M GGUF` (unsloth)
- Backend: `llama-server` s kontextovým oknom 16K
- Hardware: NVIDIA RTX 4060 Laptop (8GB VRAM), 32GB RAM

## Obmedzenia
Prompt musel byť krátky kvôli hardvérovým obmedzeniam.
Kontextové okno modelu bolo obmedzené na ~10-16K 
tokenov, čo spôsobovalo stratu kontextu počas 
dlhších sessions a opakovanie krokov agentom.

## Porovnanie s Deepseek
|  | Deepseek (cloud) | Gemma 4 (lokálne) |

| `Rýchlosť` | Rýchly | ~4-10 t/s |

| `Kontext` | 128K tokenov | 10-16K tokenov |

| `Dokončenie projektu` | Úplné | Čiastočné |

| `Súkromie` | Cloud | 100% lokálne |

## Možné vylepšenia v budúcnosti
V budúcnosti by mohol menší a starší model (napr. Gemma 3 4B) zvládnuť 
úlohu lepšie vďaka nižším pamäťovým nárokom, čo by umožnilo väčšie kontextové okno. 
Kvalita výstupu by však bola pravdepodobne nižšia oproti Gemma 4 12B.
