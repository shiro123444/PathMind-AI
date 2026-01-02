/**
 * 情景题型组件
 */

import { motion } from 'framer-motion'
import type { ScenarioQuestion as ScenarioQuestionType, ScenarioAnswer } from '../../types/mbti'
import { neutral, primary } from '../../theme/colors'

interface ScenarioQuestionProps {
  question: ScenarioQuestionType
  answer?: ScenarioAnswer
  onAnswer: (answer: ScenarioAnswer) => void
}

export default function ScenarioQuestion({ question, answer, onAnswer }: ScenarioQuestionProps) {
  const handleSelect = (index: number) => {
    onAnswer({
      questionId: question.id,
      type: 'scenario',
      selectedIndex: index,
    })
  }

  return (
    <div className="space-y-6">
      {/* 题目标题 */}
      <h2 
        className="text-xl md:text-2xl font-bold leading-relaxed"
        style={{ color: neutral[900] }}
      >
        {question.text}
      </h2>

      {/* 情景描述 */}
      <div 
        className="p-5 rounded-2xl"
        style={{ 
          background: `linear-gradient(135deg, ${primary[50]} 0%, ${neutral[50]} 100%)`,
          border: `1px solid ${primary[100]}`,
        }}
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl">📖</span>
          <p 
            className="text-base leading-relaxed"
            style={{ color: neutral[700] }}
          >
            {question.scenario}
          </p>
        </div>
      </div>

      {/* 选项 */}
      <div className="space-y-3">
        <p className="text-sm font-medium" style={{ color: neutral[500] }}>
          你会怎么做？
        </p>
        
        {question.options.map((option, index) => {
          const isSelected = answer?.selectedIndex === index
          const optionLabel = String.fromCharCode(65 + index) // A, B, C, D...
          
          return (
            <motion.button
              key={index}
              onClick={() => handleSelect(index)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full p-4 rounded-xl text-left transition-all duration-200 flex items-start gap-3 border"
              style={{
                borderColor: isSelected ? primary[500] : neutral[200],
                background: isSelected ? `${primary[500]}10` : 'rgba(255,255,255,0.6)',
              }}
            >
              {/* 选项标签 */}
              <div 
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold transition-colors"
                style={{
                  background: isSelected ? primary[600] : neutral[200],
                  color: isSelected ? 'white' : neutral[600],
                }}
              >
                {optionLabel}
              </div>

              {/* 选项文本 */}
              <span 
                className="font-medium pt-0.5"
                style={{ color: neutral[800] }}
              >
                {option.text}
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
